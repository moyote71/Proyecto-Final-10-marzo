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

    // Mapeo de campos iniciales si vienen del backend (address -> address)
    const [formData, setFormData] = useState({
        name: "",
        address: "", // Backend usa 'address'
        city: "",
        state: "", // Requerido por backend
        postalCode: "",
        country: "México",
        phone: "", // Requerido por backend
        addressType: "home",
        isDefault: false,
        ...initialValues,
    });

    // Cargar valores iniciales al editar
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            // Asegurar que mapeamos campos viejos si existen
            setFormData({
                name: initialValues.name || "",
                address: initialValues.address || initialValues.address1 || "",
                city: initialValues.city || "",
                state: initialValues.state || "",
                postalCode: initialValues.postalCode || "",
                country: initialValues.country || "México",
                phone: initialValues.phone || "",
                addressType: initialValues.addressType || "home",
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
        onSubmit(formData);

        if (!isEdit) {
            setFormData({
                name: "",
                address: "",
                city: "",
                state: "",
                postalCode: "",
                country: "México",
                phone: "",
                addressType: "home",
                isDefault: false,
            });
        }
    };

    return (
        <form className={S.form} onSubmit={handleSubmit}>
            <h3 className={S.title}>
                {isEdit ? "Editar Dirección" : "Nueva Dirección"}
            </h3>

            <Input
                label="Alias (Ej: Casa, Oficina)"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <Input
                label="Calle y Número"
                name="address"
                value={formData.address}
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
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
            />

            <Input
                label="Código Postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
            />

            <Input
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 dígitos"
                required
            />

            <div className={S.checkboxWrapper}>
                <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
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
