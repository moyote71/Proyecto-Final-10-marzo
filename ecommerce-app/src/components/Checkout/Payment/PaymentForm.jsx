import { useEffect, useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import * as styles from "./PaymentFormStyles";

const PaymentForm = ({
    onSubmit,
    onCancel,
    initialValues = {},
    isEdit = false,
}) => {
    const [formData, setFormData] = useState({
        alias: "",
        cardNumber: "",
        placeHolder: "",
        expireDate: "",
        cvv: "",
        default: false,
        ...initialValues,
    });

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            setFormData({
                alias: "",
                cardNumber: "",
                placeHolder: "",
                expireDate: "",
                cvv: "",
                default: false,
                ...initialValues,
            });
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);

        if (!isEdit) {
            setFormData({
                alias: "",
                cardNumber: "",
                placeHolder: "",
                expireDate: "",
                cvv: "",
                default: false,
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>
                {isEdit ? "Editar Método de Pago" : "Nuevo Método de Pago"}
            </h3>

            <Input
                label="Alias de la tarjeta"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                required
            />

            <Input
                label="Número de tarjeta"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                placeholder="1234-5678-9012-3456"
                required
            />

            <Input
                label="Nombre del titular"
                name="placeHolder"
                value={formData.placeHolder}
                onChange={handleChange}
                required
            />

            <div className={styles.row}>
                <Input
                    label="Fecha de expiración"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    pattern="[0-9]{2}/[0-9]{2}"
                    required
                />

                <Input
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    type="password"
                    maxLength="4"
                    pattern="[0-9]{3,4}"
                    required
                />
            </div>

            <div className={styles.checkbox}>
                <input
                    type="checkbox"
                    name="default"
                    checked={formData.default}
                    onChange={handleChange}
                    id="defaultPayment"
                    className="w-4 h-4"
                />
                <label htmlFor="defaultPayment" className="text-gray-700">
                    Establecer como método de pago predeterminado
                </label>
            </div>

            <div className={styles.actions}>
                <Button type="submit">
                    {isEdit ? "Guardar Cambios" : "Agregar Método de Pago"}
                </Button>

                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
};

export default PaymentForm;
