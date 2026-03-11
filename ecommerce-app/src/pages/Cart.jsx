import { useNavigate } from "react-router-dom";
import CartView from "../components/Cart/CartView";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon/Icon";
import { useCart } from "../context/CartContext";
import { cartStyles } from "./CartStyles";

export default function Cart() {
    const { cartItems, clearCart, getTotalItems, getTotalPrice } = useCart();

    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className={cartStyles.empty()}>
                <Icon name="cart" size={100} />
                <h2 className={cartStyles.emptyTitle()}>Tu carrito está vacío</h2>
                <p className={cartStyles.emptyText()}>
                    Agrega algunos productos para empezar a comprar
                </p>
                <Button variant="primary" onClick={() => navigate("/")}>
                    <span>Continuar Comprando</span>
                </Button>
            </div>
        );
    }

    return (
        <div className={cartStyles.wrapper()}>
            {/* Encabezado */}
            <div className="w-full">
                <div className={cartStyles.header()}>
                    <div className={cartStyles.headerTitle()}>
                        <Icon name="cart" size={32} />
                        <h1>Carrito de Compras</h1>
                    </div>

                    <div className={cartStyles.headerInfo()}>
                        <span className={cartStyles.itemsCount()}>
                            {getTotalItems()}{" "}
                            {getTotalItems() === 1 ? "artículo" : "artículos"}
                        </span>

                        <Button
                            variant="ghost"
                            className="danger"
                            onClick={clearCart}
                            title="Vaciar carrito"
                            size="sm"
                        >
                            <Icon name="trash" size={18} />
                            <span>Vaciar carrito</span>
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                <div className={cartStyles.itemsWrapper()}>
                    <CartView />

                    {/* Resumen */}
                    <div className={cartStyles.summary()}>
                        <div className={cartStyles.totalBox()}>
                            <span className={cartStyles.totalLabel()}>
                                Total a pagar
                            </span>
                            <h2 className={cartStyles.totalAmount()}>
                                ${getTotalPrice().toFixed(2)}
                            </h2>
                        </div>

                        <div className={cartStyles.actions()}>
                            <Button
                                variant="primary"
                                onClick={() => navigate("/checkout")}
                                size="lg"
                                disabled={!cartItems || cartItems.length === 0}
                                title={
                                    !cartItems || cartItems.length === 0
                                        ? "Agrega productos al carrito para continuar"
                                        : "Proceder al pago"
                                }
                            >
                                <Icon name="creditCard" size={20} />
                                <span>Proceder al pago</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
