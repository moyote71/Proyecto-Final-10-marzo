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
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod as deletePaymentMethodAPI,
} from "../services/paymentService";
import {
    getDefaultShippingAddress,
    getShippingAddresses,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress as deleteShippingAddressAPI,
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

    //calculo financiero
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const subtotal = useMemo(() => getTotalPrice() || 0, [cartItems, getTotalPrice]);
    const TAX_RATE = 0.16;
    const SHIPPING_RATE = 350;
    const FREE_SHIPPING_THRESHOLD = 1000;

    const taxAmount = useMemo(() => subtotal * TAX_RATE, [subtotal]);
    const shippingCost = useMemo(() => subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE, [subtotal]);
    const grandTotal = useMemo(() => subtotal + taxAmount + shippingCost, [subtotal, taxAmount, shippingCost]);

    const [isOrderFinished, setIsOrderFinished] = useState(false);

    const money = (v) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(v);

    //redirección si carrito vacío
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            if (!isOrderFinished) navigate("/cart");
        }
    }, [cartItems, navigate, isOrderFinished]);

    //estados principales
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

    //cargar datos iniciales
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
            } catch {
                setLocalError("Error cargando direcciones o métodos de pago.");
            } finally {
                setLoadingLocal(false);
            }
        }
        load();
    }, []);

    //handlers direcciones
    const handleAddressToggle = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressSectionOpen((p) => !p);
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddress(addr);
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressSectionOpen(false);
    };

    const handleAddressNew = () => {
        setShowAddressForm(true);
        setEditingAddress(null);
        setAddressSectionOpen(true);
    };

    const handleAddressEdit = (addr) => {
        setShowAddressForm(true);
        setEditingAddress(addr);
        setAddressSectionOpen(true);
    };

    const handleAddressDelete = async (addr) => {
        try {
            await deleteShippingAddressAPI(addr._id);
            const updated = addresses.filter((a) => a._id !== addr._id);
            if (selectedAddress?._id === addr._id) {
                setSelectedAddress(updated[0] || null);
            }
            setAddresses(updated);
        } catch (error) {
            setLocalError("Error al eliminar dirección");
        }
    };

    const handleAddressSubmit = async (data) => {
        try {
            setLocalError(null);
            let saved;
            let updated;

            if (editingAddress) {
                saved = await updateShippingAddress(editingAddress._id, data);
                updated = addresses.map((a) =>
                    a._id === editingAddress._id ? saved : a
                );
            } else {
                saved = await createShippingAddress(data);
                updated = [...addresses, saved];
            }

            setAddresses(updated);
            setSelectedAddress(saved);
            setShowAddressForm(false);
            setEditingAddress(null);
            setAddressSectionOpen(false);
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Error al guardar dirección";
            setLocalError(msg);
        }
    };

    const handleCancelAddress = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressSectionOpen(false);
    };

    //handlers pagos 
    const handlePaymentToggle = () => {
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentSectionOpen((p) => !p);
    };

    const handleSelectPayment = (pay) => {
        setSelectedPayment(pay);
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentSectionOpen(false);
    };

    const handlePaymentNew = () => {
        setShowPaymentForm(true);
        setEditingPayment(null);
        setPaymentSectionOpen(true);
    };

    const handlePaymentEdit = (pay) => {
        setShowPaymentForm(true);
        setEditingPayment(pay);
        setPaymentSectionOpen(true);
    };

    const handlePaymentDelete = async (pay) => {
        try {
            await deletePaymentMethodAPI(pay._id);
            const updated = payments.filter((p) => p._id !== pay._id);
            if (selectedPayment?._id === pay._id) {
                setSelectedPayment(updated[0] || null);
            }
            setPayments(updated);
        } catch (error) {
            setLocalError("Error al eliminar método de pago");
        }
    };

    const handlePaymentSubmit = async (data) => {
        try {
            setLocalError(null);
            let saved;
            let updated;

            if (editingPayment) {
                saved = await updatePaymentMethod(editingPayment._id, data);
                updated = payments.map((p) =>
                    p._id === editingPayment._id ? saved : p
                );
            } else {
                saved = await createPaymentMethod(data);
                updated = [...payments, saved];
            }

            setPayments(updated);
            setSelectedPayment(saved);
            setShowPaymentForm(false);
            setEditingPayment(null);
            setPaymentSectionOpen(false);
        } catch (error) {
            const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Error al guardar método de pago";
            setLocalError(msg);
        }
    };

    const handleCancelPayment = () => {
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentSectionOpen(false);
    };

    //finalizar orden
    const handleCreateOrder = async () => {
        if (!selectedAddress || !selectedPayment) return;
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
            const response = await http.post("/orders", orderData);
            
            const orderId = response.data?._id || response.data?.id;
            setIsOrderFinished(true);
            clearCart();
            navigate(`/order-confirmation${orderId ? `?orderId=${orderId}` : ""}`, { state: { order: response.data } });
        } catch (error) {
            setLocalError(error.message || "Error al crear la orden. Inténtalo más tarde.");
        }
    };

    // UI states 
    if (loadingLocal) return <Loading message="Cargando datos..." />;
    if (localError) return <ErrorMessage message={localError} />;

    return (
        <div className={styles.checkoutContainer()}>
            {/* LEFT */}
            <div className={styles.checkoutLeft()}>
                <SummarySection
                    title="1. Dirección de envío"
                    selected={selectedAddress}
                    summaryContent={
                        selectedAddress && (
                            <div>
                                <p>{selectedAddress.name}</p>
                                <p>{selectedAddress.address}</p>
                                <p>
                                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                                </p>
                            </div>
                        )
                    }
                    isExpanded={
                        showAddressForm || addressSectionOpen || !selectedAddress
                    }
                    onToggle={handleAddressToggle}
                >
                    {!showAddressForm ? (
                        <AddressList
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            onSelect={handleSelectAddress}
                            onEdit={handleAddressEdit}
                            onAdd={handleAddressNew}
                            onDelete={handleAddressDelete}
                        />
                    ) : (
                        <Suspense fallback={<Loading message="Cargando formulario..." />}>
                            <AddressForm
                                isEdit={!!editingAddress}
                                initialValues={editingAddress || {}}
                                onSubmit={handleAddressSubmit}
                                onCancel={handleCancelAddress}
                            />
                        </Suspense>
                    )}
                </SummarySection>

                <SummarySection
                    title="2. Método de pago"
                    selected={selectedPayment}
                    summaryContent={
                        selectedPayment && (
                            <div>
                                <p>{selectedPayment.alias}</p>
                                <p>**** {selectedPayment.cardNumber?.slice(-4)}</p>
                            </div>
                        )
                    }
                    isExpanded={
                        showPaymentForm || paymentSectionOpen || !selectedPayment
                    }
                    onToggle={handlePaymentToggle}
                >
                    {!showPaymentForm ? (
                        <PaymentList
                            payments={payments}
                            selectedPayment={selectedPayment}
                            onSelect={handleSelectPayment}
                            onEdit={handlePaymentEdit}
                            onAdd={handlePaymentNew}
                            onDelete={handlePaymentDelete}
                        />
                    ) : (
                        <Suspense fallback={<Loading message="Cargando formulario..." />}>
                            <PaymentForm
                                isEdit={!!editingPayment}
                                initialValues={editingPayment || {}}
                                onSubmit={handlePaymentSubmit}
                                onCancel={handleCancelPayment}
                            />
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
                    <h3 className="text-xl font-semibold mb-3">Resumen de la Orden</h3>

                    <p>
                        <strong>Dirección:</strong> {selectedAddress?.name}
                    </p>

                    <p>
                        <strong>Pago:</strong> {selectedPayment?.alias}
                    </p>

                    <div className="my-4 space-y-2">
                        <p>
                            <strong>Subtotal:</strong> {money(subtotal)}
                        </p>
                        <p>
                            <strong>IVA:</strong> {money(taxAmount)}
                        </p>
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
