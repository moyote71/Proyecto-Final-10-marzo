import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "../components/common/Icon/Icon";
import Loading from "../components/common/Loading/Loading";
import { http } from "../services/http";
import OrderConfirmationStyles from "./OrderConfirmationStyles";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateOrder = location.state?.order || null;
  const orderIdFromURL = searchParams.get("orderId");

  const [order, setOrder] = useState(stateOrder);
  const [loading, setLoading] = useState(!stateOrder && !!orderIdFromURL);

  useEffect(() => {
    if (stateOrder || !orderIdFromURL) return;

    const fetchOrder = async () => {
      try {
        const response = await http.get(`/orders/${orderIdFromURL}`);
        const data = response.data?.order || response.data;

if (data) {
  setOrder(data);
}else {
          navigate("/");
        }
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [stateOrder, orderIdFromURL, navigate]);

  useEffect(() => {
    if (!stateOrder && !orderIdFromURL && !order) {
      navigate("/");
    }
  }, [stateOrder, orderIdFromURL, order, navigate]);

  if (loading) {
    return (
      <div className={OrderConfirmationStyles.container()}>
        <Loading>Cargando confirmación de orden...</Loading>
      </div>
    );
  }

  if (!order) return null;

  const address = order.shippingAddress || {};
  const items = order.items || (order.products || []).map((p) => ({
    _id: p.productId?._id || p.productId || "",
    name: p.productId?.name || "Producto",
    price: p.price || 0,
    quantity: p.quantity || 1,
    subtotal: (p.price || 0) * (p.quantity || 1),
  }));

  const subtotal = order.subtotal || items.reduce((s, i) => s + (i.subtotal || i.price * i.quantity), 0);
  const tax = order.tax || 0;
  const shipping = order.shipping ?? order.shippingCost ?? 0;
  const total = order.total || order.totalPrice || subtotal + tax + shipping;
  const orderId = order.id || order._id || "N/A";

  const orderDate = (order.date || order.createdAt)
    ? new Date(order.date || order.createdAt).toLocaleDateString()
    : "No disponible";

  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  return (
    <div className={OrderConfirmationStyles.container()}>
      <div className={OrderConfirmationStyles.card()}>
        <div className={OrderConfirmationStyles.iconBox()}>
          <Icon name="checkCircle" size={64} className="text-green-500" />
        </div>

        <h1 className={OrderConfirmationStyles.title()}>¡Gracias por tu compra!</h1>

        <p className={OrderConfirmationStyles.message()}>
          Tu pedido <strong>#{typeof orderId === "string" && orderId.length > 8 ? orderId.slice(-8) : orderId}</strong> ha sido confirmado.
        </p>

        <div className={OrderConfirmationStyles.details()}>
          <h2 className={OrderConfirmationStyles.subtitle()}>Detalles de tu pedido</h2>

          <div className={OrderConfirmationStyles.orderBox()}>
            <p><strong>Fecha: </strong>{orderDate}</p>

            <h3 className="font-semibold text-lg mt-4">Productos</h3>
            <ul className={OrderConfirmationStyles.itemsList()}>
              {items.map((item, idx) => (
                <li key={item._id || idx} className={OrderConfirmationStyles.item()}>
                  <span>{item.name} x {item.quantity} · {formatMoney(item.price)}</span>
                  <span className="font-semibold">{formatMoney(item.subtotal || item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className={OrderConfirmationStyles.totals()}>
              <p><strong>Subtotal:</strong> {formatMoney(subtotal)}</p>
              {tax > 0 && <p><strong>IVA:</strong> {formatMoney(tax)}</p>}
              <p><strong>Envío:</strong> {shipping === 0 ? "Gratis" : formatMoney(shipping)}</p>
              <p className="text-lg font-bold"><strong>Total:</strong> {formatMoney(total)}</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-semibold">Dirección de envío:</p>
                <address className="not-italic text-gray-600">
                  {address.name || "Usuario"} <br />
                  {address.address || address.address1} <br />
                  {address.city}, {address.state || ""} {address.postalCode} <br />
                  {address.country}
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className={OrderConfirmationStyles.actions()}>
          <Link to="/" className={OrderConfirmationStyles.primaryBtn()}>
            <Icon name="home" size={20} />
            <span>Volver al inicio</span>
          </Link>

          <Link to="/orders" className={OrderConfirmationStyles.secondaryBtn()}>
            <Icon name="package" size={20} />
            <span>Mis pedidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
