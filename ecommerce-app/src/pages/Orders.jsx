import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon/Icon";
import Loading from "../components/common/Loading/Loading";
import { STORAGE_KEYS, readLocalJSON } from "../utils/storageHelpers";
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

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = () => {
            const stored = readLocalJSON(STORAGE_KEYS.orders) || [];
            const sorted = [...stored].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setOrders(sorted);
            setSelectedOrderId((cur) => cur ?? sorted[0]?.id ?? null);
            setLoading(false);
        };

        loadOrders();
        window.addEventListener("storage", loadOrders);
        return () => window.removeEventListener("storage", loadOrders);
    }, []);

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
                <Loading message="Cargando pedidos guardados..." />
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className={OrdersStyles.pageEmpty()}>
                <Icon name="package" size={48} />
                <h1 className="text-xl font-semibold">No tienes pedidos guardados</h1>

                <p className="text-muted max-w-md text-center">
                    Cada vez que confirmes una compra en el checkout, la orden se guardará
                    en tu navegador.
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
                            ? "Tienes 1 pedido guardado en este dispositivo"
                            : `Tienes ${orders.length} pedidos guardados`}
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
                                        <span className="font-medium">#{order.id}</span>
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
                                        Pedido #{selectedOrder.id}
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
                                        <span>IVA</span>
                                        <strong>{formatMoney(selectedOrder.tax)}</strong>
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

                                        <p>{selectedOrder.shippingAddress.address1}</p>

                                        {selectedOrder.shippingAddress.address2 && (
                                            <p>{selectedOrder.shippingAddress.address2}</p>
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
                                    {selectedOrder.items.map((item, i) => (
                                        <li key={`${selectedOrder.id}-${i}`}>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted">
                                                    Cantidad: {item.quantity} · Precio:{" "}
                                                    {formatMoney(item.price)}
                                                </p>
                                            </div>

                                            <strong>
                                                {formatMoney(
                                                    item.subtotal || item.price * item.quantity
                                                )}
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
