import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import Icon from "../common/Icon/Icon";
import { cartViewStyles as S } from "./CartViewStyles";

export default function CartView() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    return (
        <div className={S.container()}>
            <div className={S.wrapper}>
                <div className={S.header}>
                    <h2 className="text-lg font-semibold">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "artículo" : "artículos"}
                    </h2>
                </div>

                {cartItems?.map((item) => (
                    <div className={S.item} key={item._id}>
                        
                        {/* Imagen */}
                        <div className={S.itemImage}>
                            <img
                                src={item.imagesUrl[0]}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>

                        {/* Info */}
                        <div className={S.itemInfo}>
                            <h3 className="text-[1.05rem] font-semibold mb-1">
                                {item.name}
                            </h3>
                            <p className={S.price}>${item.price.toFixed(2)}</p>
                        </div>

                        {/* Cantidad */}
                        <div className={S.quantity}>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    updateQuantity(item._id, item.quantity - 1)
                                }
                            >
                                <Icon name="minus" size={15} />
                            </Button>

                            <span className={S.quantityText}>{item.quantity}</span>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                }
                            >
                                <Icon name="plus" size={15} />
                            </Button>
                        </div>

                        {/* Total */}
                        <div className={S.total}>
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Eliminar */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={S.removeButton}
                            onClick={() => removeFromCart(item._id)}
                            title="Eliminar artículo"
                        >
                            <Icon name="trash" size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
