import { useEffect, useState } from "react";
import Button from "../../common/Button/Button";
import Input from "../../common/Input/Input";
import { addressFormStyles as S } from "./AddressFormStyles";

export default function AddressForm({
    onSubmit,
    onCancel,
    initialValues = {},
    isEdit = false,
}) {

    const [formData, setFormData] = useState({
        name: "",
        address1: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        reference: "",
        default: false,
        ...initialValues,
    });

    // Cargar valores iniciales al editar
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            setFormData({ ...initialValues });
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

        //Solo resetear cuando es NUEVA dirección
        if (!isEdit) {
            setFormData({
                name: "",
                address1: "",
                address2: "",
                postalCode: "",
                city: "",
                country: "",
                reference: "",
                default: false,
            });
        }
    };

    return (
        <form className={S.form} onSubmit={handleSubmit}>
            <h3 className={S.title}>
                {isEdit ? "Editar Dirección" : "Nueva Dirección"}
            </h3>

            <Input
                label="Nombre de la dirección"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <Input
                label="Dirección Línea 1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
            />

            <Input
                label="Dirección Línea 2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
            />

            <Input
                label="Código Postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
            />

            <Input
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />

            <Input
                label="País"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
            />

            <Input
                label="Referencia"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
            />

            <div className={S.checkboxWrapper}>
                <input
                    type="checkbox"
                    name="default"
                    checked={formData.default}
                    onChange={handleChange}
                    id="defaultAddress"
                    className={S.checkbox}
                />
                <label htmlFor="defaultAddress" className={S.checkboxLabel}>
                    Establecer como dirección predeterminada
                </label>
            </div>

            <div className={S.actions}>
                <Button type="submit">
                    {isEdit ? "Guardar Cambios" : "Agregar Dirección"}
                </Button>

                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
}
