import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/Cart/CartView";
import AddressForm from "../components/Checkout/Address/AddressForm";
import AddressList from "../components/Checkout/Address/AddressList";
import PaymentForm from "../components/Checkout/Payment/PaymentForm";
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

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, total, clearCart } = useCart();

    //calculo financiero
    const subtotal = total || 0;
    const TAX_RATE = 0.16;
    const SHIPPING_RATE = 350;
    const FREE_SHIPPING_THRESHOLD = 1000;

    const taxAmount = subtotal * TAX_RATE;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
    const grandTotal = subtotal + taxAmount + shippingCost;

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

    const handleAddressDelete = (addr) => {
        const updated = addresses.filter((a) => a._id !== addr._id);
        if (selectedAddress?._id === addr._id) {
            setSelectedAddress(updated[0] || null);
        }
        setAddresses(updated);
    };

    const handleAddressSubmit = (data) => {
        let updated;
        let newSelected = selectedAddress;

        if (editingAddress) {
            updated = addresses.map((a) =>
                a._id === editingAddress._id ? { ...a, ...data } : a
            );
            if (selectedAddress?._id === editingAddress._id) {
                newSelected = updated.find((a) => a._id === editingAddress._id);
            }
        } else {
            const newAddr = { _id: Date.now().toString(), ...data };
            updated = [...addresses, newAddr];
            newSelected = newAddr;
        }

        setAddresses(updated);
        setSelectedAddress(newSelected);
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressSectionOpen(false);
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

    const handlePaymentDelete = (pay) => {
        const updated = payments.filter((p) => p._id !== pay._id);
        if (selectedPayment?._id === pay._id) {
            setSelectedPayment(updated[0] || null);
        }
        setPayments(updated);
    };

    const handlePaymentSubmit = (data) => {
        let updated;
        let newSelected = selectedPayment;

        if (editingPayment) {
            updated = payments.map((p) =>
                p._id === editingPayment._id ? { ...p, ...data } : p
            );
            if (selectedPayment?._id === editingPayment._id) {
                newSelected = updated.find((p) => p._id === editingPayment._id);
            }
        } else {
            const newPay = { _id: Date.now().toString(), ...data };
            updated = [...payments, newPay];
            newSelected = newPay;
        }

        setPayments(updated);
        setSelectedPayment(newSelected);
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentSectionOpen(false);
    };

    const handleCancelPayment = () => {
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentSectionOpen(false);
    };

    //finalizar orden
    const handleCreateOrder = () => {
        if (!selectedAddress || !selectedPayment) return;

        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cartItems.map((i) => ({ ...i, subtotal: i.price * i.quantity })),
            subtotal,
            tax: taxAmount,
            shipping: shippingCost,
            total: grandTotal,
            shippingAddress: selectedAddress,
            paymentMethod: selectedPayment,
            status: "confirmed",
        };

        const store = JSON.parse(localStorage.getItem("orders") || "[]");
        store.push(order);
        localStorage.setItem("orders", JSON.stringify(store));

        setIsOrderFinished(true);
        clearCart();
        navigate("/order-confirmation", { state: { order } });
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
                                <p>{selectedAddress.address1}</p>
                                <p>
                                    {selectedAddress.city}, {selectedAddress.postalCode}
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
                        <AddressForm
                            isEdit={!!editingAddress}
                            initialValues={editingAddress || {}}
                            onSubmit={handleAddressSubmit}
                            onCancel={handleCancelAddress}
                        />
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
                        <PaymentForm
                            isEdit={!!editingPayment}
                            initialValues={editingPayment || {}}
                            onSubmit={handlePaymentSubmit}
                            onCancel={handleCancelPayment}
                        />
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
