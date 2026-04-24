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
    deleteShippingAddress,
} from "../services/shippingService";

import {
    getPaymentMethods,
    getDefaultPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
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
       REDIRECT SAFE (FIX BLANK PAGE)
    ========================= */
    useEffect(() => {
        if (!user?._id) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (Array.isArray(cartItems) && cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems, navigate]);

    /* =========================
       CALCULOS SAFE
    ========================= */
    const subtotal = useMemo(() => {
        if (!Array.isArray(cartItems)) return 0;
        return getTotalPrice?.() || 0;
    }, [cartItems, getTotalPrice]);

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

    const money = (v) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(v);

    const [isOrderFinished, setIsOrderFinished] = useState(false);

    /* =========================
       STATES SAFE
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

    const [addressOpen, setAddressOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);

    /* =========================
       LOAD DATA SAFE (NO CRASH)
    ========================= */
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [addrList, defAddr, payList, defPay] =
                    await Promise.all([
                        getShippingAddresses(),
                        getDefaultShippingAddress(),
                        getPaymentMethods(),
                        getDefaultPaymentMethod(),
                    ]);

                setAddresses(addrList || []);
                setPayments(payList || []);

                setSelectedAddress(defAddr || null);
                setSelectedPayment(defPay || null);

                setAddressOpen(!defAddr);
                setPaymentOpen(!defPay);
            } catch (err) {
                console.error(err);
                setError("Error cargando checkout");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    /* =========================
       ADDRESS
    ========================= */
    const handleAddressSubmit = async (data) => {
        try {
            let saved;

            if (editingAddress) {
                saved = await updateShippingAddress(
                    editingAddress._id,
                    data
                );

                setAddresses((prev) =>
                    prev.map((a) =>
                        a._id === editingAddress._id ? saved : a
                    )
                );
            } else {
                saved = await createShippingAddress(data);
                setAddresses((prev) => [...prev, saved]);
            }

            setSelectedAddress(saved);
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressOpen(false);
        } catch (err) {
            setError("Error en dirección");
        }
    };

    const handleDeleteAddress = async (addr) => {
        try {
            await deleteShippingAddress(addr._id);

            const updated = addresses.filter(
                (a) => a._id !== addr._id
            );

            setAddresses(updated);

            if (selectedAddress?._id === addr._id) {
                setSelectedAddress(updated[0] || null);
            }
        } catch (err) {
            setError("Error eliminando dirección");
        }
    };

    /* =========================
       PAYMENT
    ========================= */
    const handlePaymentSubmit = async (data) => {
        try {
            let saved;

            if (editingPayment) {
                saved = await updatePaymentMethod(
                    editingPayment._id,
                    data
                );

                setPayments((prev) =>
                    prev.map((p) =>
                        p._id === editingPayment._id ? saved : p
                    )
                );
            } else {
                saved = await createPaymentMethod(data);
                setPayments((prev) => [...prev, saved]);
            }

            setSelectedPayment(saved);
            setShowPaymentForm(false);
            setEditingPayment(null);
            setPaymentOpen(false);
        } catch (err) {
            setError("Error en pago");
        }
    };

    const handleDeletePayment = async (pay) => {
        try {
            await deletePaymentMethod(pay._id);

            const updated = payments.filter(
                (p) => p._id !== pay._id
            );

            setPayments(updated);

            if (selectedPayment?._id === pay._id) {
                setSelectedPayment(updated[0] || null);
            }
        } catch (err) {
            setError("Error eliminando pago");
        }
    };

    /* =========================
       CREATE ORDER SAFE
    ========================= */
    const handleCreateOrder = async () => {
        if (!user?._id) return;

        if (!selectedAddress || !selectedPayment) return;

        try {
            const payload = {
                user: user._id,
                products: (cartItems || []).map((i) => ({
                    productId: i._id,
                    quantity: i.quantity,
                    price: i.price,
                })),
                shippingAddress: selectedAddress._id,
                paymentMethod: selectedPayment._id,
                shippingCost,
            };

            const res = await http.post("/orders", payload);

            const order = res.data;

            setIsOrderFinished(true);
            clearCart();

            navigate("/order-confirmation", {
                state: { order },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Error al crear la orden"
            );
        }
    };

    /* =========================
       LOADING / ERROR SAFE
    ========================= */
    if (loading) return <Loading message="Cargando checkout..." />;

    if (error) return <ErrorMessage message={error} />;

    /* =========================
       UI
    ========================= */
    return (
        <div className={styles.checkoutContainer()}>
            <div className={styles.checkoutLeft()}>
                <SummarySection
                    title="1. Dirección"
                    selected={selectedAddress}
                    isExpanded={addressOpen || !selectedAddress}
                    onToggle={() =>
                        setAddressOpen((prev) => !prev)
                    }
                >
                    {!showAddressForm ? (
                        <AddressList
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelect={setSelectedAddress}
                            onAdd={() =>
                                setShowAddressForm(true)
                            }
                            onEdit={(a) => {
                                setEditingAddress(a);
                                setShowAddressForm(true);
                            }}
                            onDelete={handleDeleteAddress}
                        />
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <AddressForm
                                isEdit={!!editingAddress}
                                initialValues={
                                    editingAddress || {}
                                }
                                onSubmit={handleAddressSubmit}
                                onCancel={() =>
                                    setShowAddressForm(false)
                                }
                            />
                        </Suspense>
                    )}
                </SummarySection>

                <SummarySection
                    title="2. Pago"
                    selected={selectedPayment}
                    isExpanded={paymentOpen || !selectedPayment}
                    onToggle={() =>
                        setPaymentOpen((p) => !p)
                    }
                >
                    {!showPaymentForm ? (
                        <PaymentList
                            payments={payments}
                            selectedPayment={selectedPayment}
                            onSelect={setSelectedPayment}
                            onAdd={() =>
                                setShowPaymentForm(true)
                            }
                            onEdit={(p) => {
                                setEditingPayment(p);
                                setShowPaymentForm(true);
                            }}
                            onDelete={handleDeletePayment}
                        />
                    ) : (
                        <Suspense fallback={<Loading />}>
                            <PaymentForm
                                isEdit={!!editingPayment}
                                initialValues={
                                    editingPayment || {}
                                }
                                onSubmit={handlePaymentSubmit}
                                onCancel={() =>
                                    setShowPaymentForm(false)
                                }
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
                        Envío:{" "}
                        {shippingCost === 0
                            ? "Gratis"
                            : money(shippingCost)}
                    </p>

                    <hr />

                    <p>
                        <b>Total: {money(grandTotal)}</b>
                    </p>

                    <Button
                        variant="primary"
                        disabled={
                            !selectedAddress || !selectedPayment
                        }
                        onClick={handleCreateOrder}
                    >
                        Confirmar orden
                    </Button>
                </div>
            </div>
        </div>
    );
}