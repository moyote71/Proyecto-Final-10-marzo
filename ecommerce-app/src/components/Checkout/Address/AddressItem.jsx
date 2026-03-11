import Button from "../../common/Button";
import * as styles from "./AddressItemStyles";

const AddressItem = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
    return (
        <div className={styles.container(isSelected, address.default)}>
            <div className="mb-4">
                <h4 className={styles.title}>{address.name}</h4>

                <p className={styles.text}>{address.address1}</p>

                {address.address2 && (
                    <p className={styles.text}>{address.address2}</p>
                )}
                <p className={styles.text}>
                    {address.city}, {address.postalCode}
                </p>

                {address.reference && (
                    <p className={styles.text}>{address.reference}</p>
                )}

                {address.default && (
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

                <Button variant="danger" onClick={() => onDelete(address.id)}>
                    Eliminar
                </Button>
            </div>
        </div>
    );
};


export default AddressItem;
