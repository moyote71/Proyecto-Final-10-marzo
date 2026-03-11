import Button from "../../common/Button";
import * as styles from "./PaymentItemStyles";

const PaymentItem = ({ payment, isSelected, onSelect, onEdit, onDelete }) => {
    const maskCardNumber = (number) => {
        if (!number) return "**** **** **** ****";
        return `**** **** **** ${number.slice(-4)}`;
    };

    return (
        <div
            className={`
                ${styles.item}
                ${isSelected ? styles.selected : ""}
                ${payment.isDefault ? styles.defaultItem : ""}
            `}
        >
            {/* Contenido */}
            <div className={styles.content}>
                <h4 className={styles.title}>{payment.alias}</h4>
                <p>{maskCardNumber(payment.cardNumber)}</p>
                <p>Vence: {payment.expireDate}</p>
                <p>Titular: {payment.placeHolder}</p>

                {payment.isDefault && (
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

                <Button variant="danger" onClick={() => onDelete(payment.id)}>
                    Eliminar
                </Button>
            </div>
        </div>
    );
};

export default PaymentItem;
