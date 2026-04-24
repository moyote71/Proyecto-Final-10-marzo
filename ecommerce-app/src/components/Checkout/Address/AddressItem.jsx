import Button from "../../common/Button";
import * as styles from "./AddressItemStyles";

const AddressItem = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
    // Normalizar para mostrar datos tanto de backend como de fakes anteriores
    const name = address.name || "Sin nombre";
    const line1 = address.address || address.address_line || address.address1 || "Sin dirección";
    const city = address.city || "";
    const state = address.state || "";
    const cp = address.postalCode || "";
    const isDefault = address.isDefault || address.default || false;

    return (
        <div className={styles.container(isSelected, isDefault)}>
            <div className="mb-4">
                <h4 className={styles.title}>{name}</h4>

                <p className={styles.text}>{line1}</p>

                <p className={styles.text}>
                    {city}{state ? `, ${state}` : ""} {cp}
                </p>

                {isDefault && (
                    <span className={styles.defaultBadge}>Predeterminada</span>
                )}
            </div>

            <div className={styles.actions}>
                <Button
                    onClick={() => onSelect(address)}
                    disabled={isSelected}
                >
                    {isSelected ? "Seleccionada" : "Seleccionar"}
                </Button>

                <Button variant="secondary" onClick={() => onEdit(address)}>
                    Editar
                </Button>

                <Button variant="danger" onClick={() => onDelete(address._id || address.id)}>
                    Eliminar
                </Button>
            </div>
        </div>
    );
};


export default AddressItem;
