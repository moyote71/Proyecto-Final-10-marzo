import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import CartView from "../components/Cart/CartView";
import AddressList from "../components/Checkout/Address/AddressList";
import PaymentList from "../components/Checkout/Payment/PaymentList";
import SummarySection from "../components/Checkout/shared/SummarySection";
import Button from "../components/common/Button/Button";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
  getShippingAddresses,
  getDefaultShippingAddress,
  createShippingAddress,
  updateShippingAddress,
} from "../services/shippingService";

import {
  getPaymentMethods,
  getDefaultPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
} from "../services/paymentService";

import { http } from "../services/http";
import * as styles from "./CheckoutStyles";

const AddressForm = lazy(() =>
  import("../components/Checkout/Address/AddressForm")
);

const PaymentForm = lazy(() =>
  import("../components/Checkout/Payment/PaymentForm")
);

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  /* =========================
     CALCULOS
  ========================= */
  const subtotal = useMemo(() => {
    return Array.isArray(cartItems) ? getTotalPrice?.() || 0 : 0;
  }, [cartItems, getTotalPrice]);

  const TAX_RATE = 0.16;
  const SHIPPING_RATE = 350;
  const FREE_SHIPPING_THRESHOLD = 1000;

  const taxAmount = subtotal * TAX_RATE;

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;

  const grandTotal = subtotal + taxAmount + shippingCost;

  const money = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  /* =========================
     STATE
  ========================= */
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);

      try {
        const addrList = await getShippingAddresses();
        const payList = await getPaymentMethods();

        const defAddr = await getDefaultShippingAddress();
        const defPay = await getDefaultPaymentMethod();

        setAddresses(addrList || []);
        setPayments(payList || []);

        setSelectedAddress(defAddr || addrList?.[0] || null);
        setSelectedPayment(defPay || payList?.[0] || null);
      } catch (err) {
        console.error(err);
        setError("Error cargando checkout");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  /* =========================
     SAVE ADDRESS
  ========================= */
  const handleAddressSubmit = async (data) => {
    try {
      let saved;

      if (editingAddress) {
        saved = await updateShippingAddress(editingAddress._id, data);
      } else {
        saved = await createShippingAddress(data);
      }

      setAddresses((prev) => [...prev, saved]);
      setSelectedAddress(saved);

      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error(err);
      setError("Error guardando dirección");
    }
  };

  /* =========================
     SAVE PAYMENT
  ========================= */
  const handlePaymentSubmit = async (data) => {
    try {
      let saved;

      if (editingPayment) {
        saved = await updatePaymentMethod(editingPayment._id, data);
      } else {
        saved = await createPaymentMethod(data);
      }

      setPayments((prev) => [...prev, saved]);
      setSelectedPayment(saved);

      setShowPaymentForm(false);
      setEditingPayment(null);
    } catch (err) {
      console.error(err);
      setError("Error guardando pago");
    }
  };

  /* =========================
     CREATE ORDER
  ========================= */
  const handleCreateOrder = async () => {
  if (!selectedAddress || !selectedPayment) {
    setError("Selecciona dirección y pago");
    return;
  }

  try {
    const res = await http.post("/orders/checkout");

    clearCart();

    navigate("/order-confirmation", {
      state: { order: res.data.order },
    });
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Error creando orden");
  }
};                    

  if (loading) return <Loading message="Cargando checkout..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.checkoutContainer()}>
      <div className={styles.checkoutLeft()}>
        {/* =========================
           DIRECCIÓN
        ========================= */}
        <SummarySection title="1. Dirección" isExpanded>
          {!showAddressForm ? (
            <AddressList
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelect={setSelectedAddress}
              onAdd={() => setShowAddressForm(true)}
              onEdit={(a) => {
                setEditingAddress(a);
                setShowAddressForm(true);
              }}
            />
          ) : (
            <Suspense fallback={<Loading />}>
              <AddressForm
                isEdit={!!editingAddress}
                initialValues={editingAddress || {}}
                onSubmit={handleAddressSubmit}
                onCancel={() => setShowAddressForm(false)}
              />
            </Suspense>
          )}
        </SummarySection>

        {/* =========================
           PAGO
        ========================= */}
        <SummarySection title="2. Pago" isExpanded>
          {!showPaymentForm ? (
            <PaymentList
              payments={payments}
              selectedPayment={selectedPayment}
              onSelect={setSelectedPayment}
              onAdd={() => setShowPaymentForm(true)}
              onEdit={(p) => {
                setEditingPayment(p);
                setShowPaymentForm(true);
              }}
            />
          ) : (
            <Suspense fallback={<Loading />}>
              <PaymentForm
                isEdit={!!editingPayment}
                initialValues={editingPayment || {}}
                onSubmit={handlePaymentSubmit}
                onCancel={() => setShowPaymentForm(false)}
              />
            </Suspense>
          )}
        </SummarySection>

        <SummarySection title="3. Carrito" isExpanded>
          <CartView />
        </SummarySection>
      </div>

      <div className={styles.checkoutRight()}>
        <div className={styles.summaryBox()}>
          <h3>Resumen</h3>

          <p>Subtotal: {money(subtotal)}</p>
          <p>IVA: {money(taxAmount)}</p>
          <p>
            Envío: {shippingCost === 0 ? "Gratis" : money(shippingCost)}
          </p>

          <hr />

          <p>
            <b>Total: {money(grandTotal)}</b>
          </p>

          <Button
            variant="primary"
            disabled={!selectedAddress || !selectedPayment}
            onClick={handleCreateOrder}
          >
            Confirmar orden
          </Button>
        </div>
      </div>
    </div>
  );
}