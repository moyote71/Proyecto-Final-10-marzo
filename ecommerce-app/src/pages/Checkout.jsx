import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import CartView from "../components/Cart/CartView";
import AddressList from "../components/Checkout/Address/AddressList";
import PaymentList from "../components/Checkout/Payment/PaymentList";
import SummarySection from "../components/Checkout/shared/SummarySection";
import Button from "../components/common/Button/Button";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";

import {
    getShippingAddresses,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress as deleteAddressAPI,
    getDefaultShippingAddress,
} from "../services/shippingService";

import {
    getShippingAddresses,
    getDefaultShippingAddress,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
} from "../services/shippingService";

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

    const subtotal = useMemo(() => getTotalPrice(), [cartItems]);

    const TAX = 0.16;
    const SHIPPING = 350;

    const tax = subtotal * TAX;
    const shipping = subtotal > 1000 ? 0 : SHIPPING;
    const total = subtotal + tax + shipping;

    const money = (v) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(v);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);

    const [selectedAddress, setSelected] = useState(null);
    const [selectedPayment, setPayment] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [a, da, p, dp] = await Promise.all([
                    getShippingAddresses(),
                    getDefaultShippingAddress(),
                    getPaymentMethods(),
                    getDefaultPaymentMethods(),
                ]);

                setAddresses(a || []);
                setPayments(p || []);

                setSelected(da || null);
                setPayment(dp || null);
            } catch {
                setError("Error cargando checkout");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const createOrder = async () => {
        if (!user || !selectedAddress || !selectedPayment) return;

        const payload = {
            user: user._id,
            products: cartItems.map((i) => ({
                productId: i._id,
                quantity: i.quantity,
                price: i.price,
            })),
            shippingAddress: selectedAddress._id,
            paymentMethod: selectedPayment._id,
            shippingCost: shipping,
        };

        try {
            const res = await http.post("/orders", payload);

            clearCart();

            navigate("/order-confirmation", {
                state: { order: res.data },
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className={styles.checkoutContainer()}>
            <div className={styles.checkoutLeft()}>
                <SummarySection title="Dirección">
                    <AddressList
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        onSelect={setSelected}
                    />
                </SummarySection>

                <SummarySection title="Pago">
                    <PaymentList
                        payments={payments}
                        selectedPayment={selectedPayment}
                        onSelect={setPayment}
                    />
                </SummarySection>

                <SummarySection title="Carrito">
                    <CartView />
                </SummarySection>
            </div>

            <div className={styles.checkoutRight()}>
                <h3>Resumen</h3>

                <p>Subtotal: {money(subtotal)}</p>
                <p>IVA: {money(tax)}</p>
                <p>Envío: {money(shipping)}</p>
                <hr />
                <b>Total: {money(total)}</b>

                <Button
                    disabled={!selectedAddress || !selectedPayment}
                    onClick={createOrder}
                >
                    Confirmar orden
                </Button>
            </div>
        </div>
    );
}