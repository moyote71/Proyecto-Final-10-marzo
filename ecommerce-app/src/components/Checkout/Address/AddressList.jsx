import Button from "../../common/Button";
import AddressItem from "./AddressItem";
import * as styles from "./AddressListStyles";

const AddressList = ({
    addresses,
    selectedAddress,
    onSelect,
    onEdit,
    onDelete,
    onAdd,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Direcciones de Envío</h3>
                <Button onClick={onAdd}>Agregar Nueva Dirección</Button>
            </div>

            <div className={styles.content}>
                {addresses.map((address) => (
                    <AddressItem
                        key={address.id || address.name}
                        address={address}
                        isSelected={selectedAddress?.id === address.id}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default AddressList;
