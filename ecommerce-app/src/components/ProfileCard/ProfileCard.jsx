import { getCurrentUser } from "../../utils/auth";
import Button from "../common/Button";
import ProfileCardStyles from "./ProfileCardStyles";

const ROLE_COLORS = {
    admin: "bg-blue-600",
    customer: "bg-green-500",
    guest: "bg-gray-400",
};

const ROLE_ACTIONS = {
    admin: [
        { label: "Editar Perfil", action: () => {} },
        { label: "Cambiar contraseña", action: () => {} },
        { label: "Ver todos los pedidos", action: () => {} },
        { label: "Panel de administración", action: () => {} },
    ],
    customer: [
        { label: "Editar Perfil", action: () => {} },
        { label: "Cambiar contraseña", action: () => {} },
        { label: "Ver mis pedidos", action: () => {} },
    ],
};

export default function ProfileCard({ user }) {
    const currentUser = user || getCurrentUser();
    const role = currentUser.role || "guest";
    const actions = ROLE_ACTIONS[role] || [];

    return (
        <div className={ProfileCardStyles.container()}>
            <div className={ProfileCardStyles.card()}>
                {/* Header */}
                <div className={ProfileCardStyles.header()}>
                    <img
                        src={currentUser.avatar || "/img/user-placeholder.png"}
                        alt={currentUser.displayName || currentUser.name || currentUser.email}
                        className={ProfileCardStyles.avatar()}
                    />

                    <div className={ProfileCardStyles.names()}>
                        <h2 className="text-xl font-semibold">
                            {currentUser.displayName ||
                                currentUser.name ||
                                currentUser.email}
                        </h2>

                        <span
                            className={`${ProfileCardStyles.roleBadge()} ${
                                ROLE_COLORS[role]
                            }`}
                        >
                            {role}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className={ProfileCardStyles.info()}>
                    <div className={ProfileCardStyles.infoItem()}>
                        <label>Email:</label>
                        <span>{currentUser.email || "No disponible"}</span>
                    </div>

                    <div className={ProfileCardStyles.infoItem()}>
                        <label>Nombre:</label>
                        <span>
                            {currentUser.displayName ||
                                currentUser.name ||
                                "No disponible"}
                        </span>
                    </div>

                    <div className={ProfileCardStyles.infoItem()}>
                        <label>Estado:</label>
                        <span>{currentUser.isActive ? "Activo" : "Inactivo"}</span>
                    </div>

                    <div className={ProfileCardStyles.infoItem()}>
                        <label>Última conexión:</label>
                        <span>
                            {currentUser.loginDate
                                ? new Date(currentUser.loginDate).toLocaleString()
                                : "No disponible"}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className={ProfileCardStyles.actions()}>
                    <h3 className="text-lg font-semibold mb-2">
                        Acciones de la cuenta
                    </h3>

                    {actions.map((action, idx) => (
                        <Button key={idx} type="button" onClick={action.action}>
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
