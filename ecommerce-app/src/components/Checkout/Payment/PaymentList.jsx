import Button from "../../common/Button";
import PaymentItem from "./PaymentItem";
import * as styles from "./PaymentListStyles";

const PaymentList = ({
    payments,
    selectedPayment,
    onSelect,
    onEdit,
    onDelete,
    onAdd,
}) => {
    return (
        <div className={styles.list}>
            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>Métodos de Pago</h3>
                <Button onClick={onAdd}>Agregar Nueva Tarjeta</Button>
            </div>

            {/* Items */}
            <div className={styles.content}>
                {payments.map((payment) => (
                    <PaymentItem
                        key={payment.id || payment.alias}
                        payment={payment}
                        isSelected={selectedPayment?.id === payment.id}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaymentList;
