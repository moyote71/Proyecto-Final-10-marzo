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
import {
    getDefaultPaymentMethods,
    getPaymentMethods,
} from "../services/paymentService";
import {
    getDefaultShippingAddress,
    getShippingAddresses,
} from "../services/shippingService";
import * as styles from "./CheckoutStyles";
import { http } from "../services/http";
import { useAuth } from "../context/AuthContext";

const AddressForm = lazy(() => import("../components/Checkout/Address/AddressForm"));
const PaymentForm = lazy(() => import("../components/Checkout/Payment/PaymentForm"));

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();

    const subtotal = useMemo(() => getTotalPrice() || 0, [cartItems, getTotalPrice]);
    const TAX_RATE = 0.16;
    const SHIPPING_RATE = 350;
    const FREE_SHIPPING_THRESHOLD = 1000;

    const taxAmount = useMemo(() => subtotal * TAX_RATE, [subtotal]);
    const shippingCost = useMemo(
        () => (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE),
        [subtotal]
    );
    const grandTotal = useMemo(
        () => subtotal + taxAmount + shippingCost,
        [subtotal, taxAmount, shippingCost]
    );

    const [isOrderFinished, setIsOrderFinished] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loadingLocal, setLoadingLocal] = useState(true);
    const [localError, setLocalError] = useState(null);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const [editingAddress, setEditingAddress] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);

    const [addressSectionOpen, setAddressSectionOpen] = useState(false);
    const [paymentSectionOpen, setPaymentSectionOpen] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const money = (v) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(v);

    // 🔁 Redirección si carrito vacío
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            if (!isOrderFinished) navigate("/cart");
        }
    }, [cartItems, navigate, isOrderFinished]);

    // 🔄 Cargar datos iniciales
    useEffect(() => {
        async function load() {
            setLoadingLocal(true);
            try {
                const [addrList, defAddr, payList, defPay] = await Promise.all([
                    getShippingAddresses(),
                    getDefaultShippingAddress(),
                    getPaymentMethods(),
                    getDefaultPaymentMethods(),
                ]);

                setAddresses(addrList || []);
                setPayments(payList || []);

                setSelectedAddress(defAddr);
                setSelectedPayment(defPay);

                setAddressSectionOpen(!defAddr);
                setPaymentSectionOpen(!defPay);
            } catch (error) {
                console.error("🔥 ERROR CARGANDO CHECKOUT:", error);
                setLocalError("Error cargando direcciones o métodos de pago.");
            } finally {
                setLoadingLocal(false);
            }
        }
        load();
    }, []);

    // 🚀 FINALIZAR ORDEN
    const handleCreateOrder = async () => {
        setLocalError(null);

        if (!selectedAddress || !selectedPayment) {
            setLocalError("Selecciona dirección y método de pago");
            return;
        }

        if (!user) {
            setLocalError("Debes iniciar sesión para completar la orden");
            return;
        }

        const orderData = {
            user: user._id,
            products: cartItems.map((i) => ({
                productId: i._id,
                quantity: i.quantity,
                price: i.price,
            })),
            shippingAddress: selectedAddress._id,
            paymentMethod: selectedPayment._id,
            shippingCost: shippingCost,
        };

        try {
            console.log("📦 Enviando orden:", orderData);

            const response = await http.post("/orders", orderData);

            console.log("✅ Orden creada:", response.data);

            const orderId = response.data?._id || response.data?.id;

            setIsOrderFinished(true);
            clearCart();

            navigate(
                `/order-confirmation${orderId ? `?orderId=${orderId}` : ""}`,
                { state: { order: response.data } }
            );
        } catch (error) {
            console.error("🔥 ERROR CHECKOUT:", error);
            console.error("🔥 RESPONSE:", error.response?.data);

            setLocalError(
                error.response?.data?.message ||
                error.message ||
                "Error al crear la orden. Inténtalo más tarde."
            );
        }
    };

    // ⏳ LOADING
    if (loadingLocal) return <Loading message="Cargando datos..." />;

    return (
        <div className={styles.checkoutContainer()}>
            
            {/* 🔴 ERROR GLOBAL */}
            {localError && (
                <div className="mb-4">
                    <ErrorMessage message={localError} />
                </div>
            )}

            {/* LEFT */}
            <div className={styles.checkoutLeft()}>
                <SummarySection
                    title="1. Dirección de envío"
                    selected={selectedAddress}
                    isExpanded={!selectedAddress}
                >
                    {!showAddressForm ? (
                        <AddressList
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelect={setSelectedAddress}
                        />
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <AddressForm />
                        </Suspense>
                    )}
                </SummarySection>

                <SummarySection
                    title="2. Método de pago"
                    selected={selectedPayment}
                    isExpanded={!selectedPayment}
                >
                    {!showPaymentForm ? (
                        <PaymentList
                            payments={payments}
                            selectedPayment={selectedPayment}
                            onSelect={setSelectedPayment}
                        />
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <PaymentForm />
                        </Suspense>
                    )}
                </SummarySection>

                <SummarySection title="3. Revisa tu pedido" isExpanded={true}>
                    <CartView />
                </SummarySection>
            </div>

            {/* RIGHT */}
            <div className={styles.checkoutRight()}>
                <div className={styles.summaryBox()}>
                    <h3 className="text-xl font-semibold mb-3">
                        Resumen de la Orden
                    </h3>

                    <p><strong>Dirección:</strong> {selectedAddress?.name}</p>
                    <p><strong>Pago:</strong> {selectedPayment?.alias}</p>

                    <div className="my-4 space-y-2">
                        <p><strong>Subtotal:</strong> {money(subtotal)}</p>
                        <p><strong>IVA:</strong> {money(taxAmount)}</p>
                        <p>
                            <strong>Envío:</strong>{" "}
                            {shippingCost === 0 ? "Gratis" : money(shippingCost)}
                        </p>
                        <hr />
                        <p className="text-lg font-bold">
                            Total: {money(grandTotal)}
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        disabled={!selectedAddress || !selectedPayment}
                        onClick={handleCreateOrder}
                    >
                        Confirmar y pagar
                    </Button>
                </div>
            </div>
        </div>
    );
}