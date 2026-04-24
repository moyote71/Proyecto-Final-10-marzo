import Button from "../../common/Button";
import * as styles from "./PaymentItemStyles";

const PaymentItem = ({ payment, isSelected, onSelect, onEdit, onDelete }) => {
    const maskCardNumber = (number) => {
        if (!number) return "**** **** **** ****";
        const clean = number.toString().replace(/\s/g, "");
        return `**** **** **** ${clean.slice(-4)}`;
    };

    // Normalización de campos
    const alias = payment.alias || "Tarjeta";
    const expiry = payment.expiryDate || payment.expireDate || "MM/YY";
    const holder = payment.cardHolderName || payment.placeHolder || "Titular";
    const isDefault = payment.isDefault || payment.default || false;

    return (
        <div
            className={`
                ${styles.item}
                ${isSelected ? styles.selected : ""}
                ${isDefault ? styles.defaultItem : ""}
            `}
        >
            {/* Contenido */}
            <div className={styles.content}>
                <h4 className={styles.title}>{alias}</h4>
                <p>{maskCardNumber(payment.cardNumber)}</p>
                <p>Vence: {expiry}</p>
                <p>Titular: {holder}</p>

                {isDefault && (
                    <span className={styles.badge}>Predeterminada</span>
                )}
            </div>

            {/* Acciones */}
            <div className={styles.actions}>
                <Button onClick={() => onSelect(payment)} disabled={isSelected}>
                    {isSelected ? "Seleccionada" : "Seleccionar"}
                </Button>

                <Button variant="secondary" onClick={() => onEdit(payment)}>
                    Editar
                </Button>

                <Button variant="danger" onClick={() => onDelete(payment._id || payment.id)}>
                    Eliminar
                </Button>
            </div>
        </div>
    );
};

export default PaymentItem;
