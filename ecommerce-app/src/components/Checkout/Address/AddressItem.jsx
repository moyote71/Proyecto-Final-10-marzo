import Button from "../../common/Button";
import * as styles from "./AddressItemStyles";

const AddressItem = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
    // Evitar crash si address viene undefined
    const safeAddress = address || {};

    // Normalizar para backend + datos antiguos
    const name = safeAddress.name || "Sin nombre";

    const line1 =
        safeAddress.address ||
        safeAddress["address line"] ||
        safeAddress.address_line ||
        safeAddress.address1 ||
        "Sin dirección";

    const city = safeAddress.city || "";
    const state = safeAddress.state || "";
    const cp = safeAddress.postalCode || "";

    const isDefault =
        safeAddress.isDefault || safeAddress.default || false;

    return (
        <div className={styles.container(isSelected, isDefault)}>
            <div className="mb-4">
                <h4 className={styles.title}>{name}</h4>

                <p className={styles.text}>{line1}</p>

                <p className={styles.text}>
                    {city}
                    {state ? `, ${state}` : ""} {cp}
                </p>

                {isDefault && (
                    <span className={styles.defaultBadge}>
                        Predeterminada
                    </span>
                )}
            </div>

            <div className={styles.actions}>
                <Button
                    onClick={() => onSelect?.(safeAddress)}
                    disabled={isSelected}
                >
                    {isSelected ? "Seleccionada" : "Seleccionar"}
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => onEdit?.(safeAddress)}
                >
                    Editar
                </Button>

                <Button
                    variant="danger"
                    onClick={() =>
                        onDelete?.(safeAddress._id || safeAddress.id)
                    }
                >
                    Eliminar
                </Button>
            </div>
        </div>
    );
};

export default AddressItem;