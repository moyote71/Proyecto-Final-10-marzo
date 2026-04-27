import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon/Icon";
import Loading from "../components/common/Loading/Loading";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import { http } from "../services/http";
import { useAuth } from "../context/AuthContext";
import * as OrdersStyles from "./OrdersStyles";

const formatMoney = (value = 0) =>
    new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(value);

const formatDate = (isoString) => {
    if (!isoString) return "Fecha desconocida";
    try {
        return new Date(isoString).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "Fecha inválida";
    }
};

/** Normaliza la respuesta del backend a una estructura consistente para la UI */
const normalizeOrder = (order) => {
    if (!order) return null;
    const products = Array.isArray(order.products) ? order.products : [];
    const items = products.map((p) => ({
        _id: p.productId?._id || p.productId || "",
        name: p.productId?.name || "Producto",
        price: p.price || p.productId?.price || 0,
        quantity: p.quantity || 1,
        subtotal: (p.price || 0) * (p.quantity || 1),
    }));

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);

    return {
        id: order._id,
        date: order.createdAt || order.updatedAt,
        status: order.status || "pending",
        items,
        subtotal,
        shipping: order.shippingCost || 0,
        tax: 0,
        total: order.totalPrice || subtotal + (order.shippingCost || 0),
        shippingAddress: order.shippingAddress || null,
        paymentMethod: order.paymentMethod || null,
    };
};

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

            useEffect(() => {
        const loadOrders = async () => {
            if (!user?._id) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                // ✅ FIX PRINCIPAL: usar sesión (JWT cookie), no userId
                const response = await http.get("/orders/my-orders");

                const rawOrders = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data || [];

                const normalized = rawOrders
                    .map(normalizeOrder)
                    .filter(Boolean);

                const sorted = normalized.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );

                setOrders(sorted);
                setSelectedOrderId((cur) => cur ?? sorted[0]?.id ?? null);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err.message || "Error al cargar pedidos");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user?._id]);                                                                

    const selectedOrder = useMemo(
        () => orders.find((o) => o.id === selectedOrderId) || null,
        [orders, selectedOrderId]
    );

    const detailStatusToken = selectedOrder
        ? (selectedOrder.status || "confirmed").toLowerCase()
        : "confirmed";

    if (loading) {
        return (
            <div className={OrdersStyles.page()}>
                <Loading message="Cargando pedidos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className={OrdersStyles.page()}>
                <ErrorMessage>{error}</ErrorMessage>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className={OrdersStyles.pageEmpty()}>
                <Icon name="package" size={48} />
                <h1 className="text-xl font-semibold">No tienes pedidos</h1>

                <p className="text-muted max-w-md text-center">
                    Cuando confirmes una compra en el checkout, tu orden aparecerá aquí.
                </p>

                <Link to="/" className="mt-4">
                    <Button>Descubrir productos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={OrdersStyles.page()}>
            {/* HEADER */}
            <div className={OrdersStyles.header()}>
                <div>
                    <p className="text-sm text-muted">Historial de compras</p>
                    <h1 className="text-2xl font-semibold">Mis pedidos</h1>

                    <p className="text-muted">
                        {orders.length === 1
                            ? "Tienes 1 pedido"
                            : `Tienes ${orders.length} pedidos`}
                    </p>
                </div>

                <Button
                    variant="secondary"
                    onClick={() => setSelectedOrderId(orders[0]?.id ?? null)}
                >
                    Ver más reciente
                </Button>
            </div>

            {/* CONTENT GRID */}
            <div className={OrdersStyles.content()}>
                {/* LISTA DE PEDIDOS */}
                <div className={OrdersStyles.listCard()}>
                    <div className={OrdersStyles.listHeader()}>
                        <h2>Pedidos</h2>
                        <span>{orders.length}</span>
                    </div>

                    <div className={OrdersStyles.listBody()}>
                        {orders.map((order) => {
                            const active = selectedOrderId === order.id;
                            const statusToken = (order.status || "confirmed").toLowerCase();

                            return (
                                <button
                                    key={order.id}
                                    className={OrdersStyles.orderCard({ active })}
                                    onClick={() => setSelectedOrderId(order.id)}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium text-xs truncate max-w-[140px]">
                                            #{order.id?.slice(-8)}
                                        </span>
                                        <span
                                            className={OrdersStyles.statusBadge({
                                                status: statusToken,
                                            })}
                                        >
                                            {order.status || "Confirmado"}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted">{formatDate(order.date)}</p>

                                    <div className="flex justify-between text-sm">
                                        <span>{order.items?.length || 0} artículos</span>
                                        <strong>{formatMoney(order.total)}</strong>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* DETALLE */}
                <div className={OrdersStyles.detailCard()}>
                    {selectedOrder ? (
                        <>
                            {/* HEADER DETALLE */}
                            <div className={OrdersStyles.detailHeader()}>
                                <div>
                                    <p className="text-sm text-muted">
                                        Pedido #{selectedOrder.id?.slice(-8)}
                                    </p>
                                    <h2 className="text-xl font-semibold">
                                        {formatMoney(selectedOrder.total)}
                                    </h2>
                                    <p className="text-muted">{formatDate(selectedOrder.date)}</p>
                                </div>

                                <span
                                    className={OrdersStyles.statusBadge({
                                        status: detailStatusToken,
                                    })}
                                >
                                    {selectedOrder.status || "Confirmado"}
                                </span>
                            </div>

                            {/* RESUMEN PAGO */}
                            <div className={OrdersStyles.section()}>
                                <h3>Resumen del pago</h3>
                                <ul className={OrdersStyles.summaryList()}>
                                    <li>
                                        <span>Subtotal</span>
                                        <strong>{formatMoney(selectedOrder.subtotal)}</strong>
                                    </li>
                                    <li>
                                        <span>Envío</span>
                                        <strong>
                                            {selectedOrder.shipping === 0
                                                ? "Gratis"
                                                : formatMoney(selectedOrder.shipping)}
                                        </strong>
                                    </li>
                                    <li className="font-semibold">
                                        <span>Total</span>
                                        <strong>{formatMoney(selectedOrder.total)}</strong>
                                    </li>
                                </ul>
                            </div>

                            {/* DIRECCIÓN */}
                            <div className={OrdersStyles.section()}>
                                <h3>Dirección de envío</h3>

                                {selectedOrder.shippingAddress ? (
                                    <address className={OrdersStyles.address()}>
                                        <strong>{selectedOrder.shippingAddress.name}</strong>

                                        <p>{selectedOrder.shippingAddress.address || selectedOrder.shippingAddress.address1}</p>

                                        {selectedOrder.shippingAddress.state && (
                                            <p>{selectedOrder.shippingAddress.state}</p>
                                        )}

                                        <p>
                                            {selectedOrder.shippingAddress.city},{" "}
                                            {selectedOrder.shippingAddress.postalCode}
                                        </p>

                                        <p>{selectedOrder.shippingAddress.country}</p>
                                    </address>
                                ) : (
                                    <p className="text-muted">Sin dirección registrada.</p>
                                )}
                            </div>

                            {/* MÉTODO DE PAGO */}
                            <div className={OrdersStyles.section()}>
                                <h3>Método de pago</h3>

                                {selectedOrder.paymentMethod ? (
                                    <div>
                                        <p>{selectedOrder.paymentMethod.alias}</p>
                                        <p>
                                            ****
                                            {selectedOrder.paymentMethod.cardNumber?.slice(-4) ||
                                                "----"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-muted">Sin método de pago registrado.</p>
                                )}
                            </div>

                            {/* PRODUCTOS */}
                            <div className={OrdersStyles.section()}>
                                <h3>Productos</h3>

                                <ul className={OrdersStyles.itemsList()}>
                                    {(selectedOrder.items || []).map((item, i) => (
                                        <li key={`${selectedOrder.id}-${i}`}>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted">
                                                    Cantidad: {item.quantity} · Precio:{" "}
                                                    {formatMoney(item.price)}
                                                </p>
                                            </div>

                                            <strong>
                                                {formatMoney(item.subtotal)}
                                            </strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted p-8">
                            Selecciona un pedido para ver sus detalles
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
