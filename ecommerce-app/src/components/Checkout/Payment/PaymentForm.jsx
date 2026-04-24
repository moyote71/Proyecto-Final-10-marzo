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
        type: "credit_card", // Requerido por backend
        alias: "",
        cardNumber: "",
        cardHolderName: "", // Backend usa 'cardHolderName'
        expiryDate: "", // Backend usa 'expiryDate'
        cvv: "",
        isDefault: false,
        ...initialValues,
    });

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            setFormData({
                type: initialValues.type || "credit_card",
                alias: initialValues.alias || "",
                cardNumber: initialValues.cardNumber || "",
                cardHolderName: initialValues.cardHolderName || initialValues.placeHolder || "",
                expiryDate: initialValues.expiryDate || initialValues.expireDate || "",
                cvv: initialValues.cvv || "",
                isDefault: initialValues.isDefault || initialValues.default || false,
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

        // Enviar solo números para la tarjeta
        const cleanData = {
            ...formData,
            cardNumber: formData.cardNumber.replace(/\D/g, ""),
        };

        onSubmit(cleanData);

        if (!isEdit) {
            setFormData({
                type: "credit_card",
                alias: "",
                cardNumber: "",
                cardHolderName: "",
                expiryDate: "",
                cvv: "",
                isDefault: false,
            });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>
                {isEdit ? "Editar Método de Pago" : "Nuevo Método de Pago"}
            </h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Tarjeta</label>
                <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                >
                    <option value="credit_card">Tarjeta de Crédito</option>
                    <option value="debit_card">Tarjeta de Débito</option>
                </select>
            </div>

            <Input
                label="Alias (Ej: Mi Visa, Nómina)"
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
                placeholder="16 dígitos"
                maxLength="16"
                required
            />

            <Input
                label="Nombre del titular"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                required
            />

            <div className={styles.row}>
                <Input
                    label="Fecha de expiración"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                />

                <Input
                    label="CVV"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    type="password"
                    maxLength="4"
                    required
                />
            </div>

            <div className={styles.checkbox}>
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
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
