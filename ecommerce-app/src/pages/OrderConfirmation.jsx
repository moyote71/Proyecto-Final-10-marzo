import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon/Icon";
import OrderConfirmationStyles from "./OrderConfirmationStyles";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  useEffect(() => {
    if (!order) navigate("/");
  }, [order, navigate]);

  const address = order?.shippingAddress || {};
  const subtotal = order?.subtotal || 0;
  const tax = order?.tax || 0;
  const shipping = order?.shipping || 0;
  const total = order?.total || 0;

  const orderDate = order?.date
    ? new Date(order.date).toLocaleDateString()
    : "No disponible";

  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  return (
    <div className={OrderConfirmationStyles.container()}>
      <div className={OrderConfirmationStyles.card()}>
        {/* ICON */}
        <div className={OrderConfirmationStyles.iconBox()}>
          <Icon name="checkCircle" size={64} className="text-green-500" />
        </div>

        <h1 className={OrderConfirmationStyles.title()}>¡Gracias por tu compra!</h1>

        <p className={OrderConfirmationStyles.message()}>
          Tu pedido <strong>#{order?.id || "N/A"}</strong> ha sido confirmado y está siendo procesado.
        </p>

        {/* --- DETALLES DEL PEDIDO --- */}
        <div className={OrderConfirmationStyles.details()}>
          <h2 className={OrderConfirmationStyles.subtitle()}>Detalles de tu pedido</h2>

          <div className={OrderConfirmationStyles.orderBox()}>
            <p>
              <strong>Fecha: </strong>
              {orderDate}
            </p>

            <h3 className="font-semibold text-lg mt-4">Productos</h3>

            <ul className={OrderConfirmationStyles.itemsList()}>
              {(order?.items || []).map((item) => (
                <li key={item._id} className={OrderConfirmationStyles.item()}>
                  <span>
                    {item.name} x {item.quantity} · {formatMoney(item.price)}
                  </span>
                  <span className="font-semibold">{formatMoney(item.subtotal)}</span>
                </li>
              ))}
            </ul>

            <div className={OrderConfirmationStyles.totals()}>
              <p>
                <strong>Subtotal:</strong> {formatMoney(subtotal)}
              </p>
              <p>
                <strong>IVA:</strong> {formatMoney(tax)}
              </p>
              <p>
                <strong>Envío:</strong> {formatMoney(shipping)}
              </p>
              <p className="text-lg font-bold">
                <strong>Total:</strong> {formatMoney(total)}
              </p>

              <p className="mt-4 font-semibold">Dirección de envío:</p>
              <address className="not-italic">
                {address.name || "No disponible"}
                <br />
                {address.address1}
                {address.address1 && <br />}
                {address.address2}
                {address.address2 && <br />}
                {address.city && address.postalCode
                  ? `${address.city}, ${address.postalCode}`
                  : "Ciudad y código postal no disponibles"}
                <br />
                {address.country || "País no especificado"}
              </address>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Hemos enviado un correo electrónico con los detalles de tu compra.
            También puedes ver tus pedidos desde tu perfil.
          </p>
        </div>

        {/* --- ACCIONES --- */}
        <div className={OrderConfirmationStyles.actions()}>
          <Link to="/" className={OrderConfirmationStyles.primaryBtn()}>
            <Icon name="home" size={20} />
            <span>Volver al inicio</span>
          </Link>

          <Link to="/orders" className={OrderConfirmationStyles.secondaryBtn()}>
            <Icon name="package" size={20} />
            <span>Ver mis pedidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
