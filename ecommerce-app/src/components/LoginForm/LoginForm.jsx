import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import { loginContainer, loginCard, demoUsers, loginForm, loginFooter } from "./LoginFormStyles";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        await new Promise((resolve) => setTimeout(resolve, 800));
        const result = await login(email, password);

        if (result.success) {
            navigate("/");
            window.location.reload();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className={loginContainer()}>
            <div className={loginCard()}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar Sesión</h2>

                <div className={demoUsers()}>
                    <h4 className="font-medium">Usuarios de prueba:</h4>

                    <div className="text-sm">
                        <strong>Cliente:</strong> cliente@email.com / cliente123
                    </div>

                    <div className="text-sm">
                        <strong>Admin:</strong> admin@email.com / admin123
                    </div>
                </div>

                <form className={loginForm()} onSubmit={onSubmit}>
                    <Input
                        id="email"
                        label="Email:"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Ingresa tu email"
                        required
                    />

                    <Input
                        id="password"
                        label="Contraseña:"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <Button disabled={loading} type="submit" variant="primary">
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>

                <div className={loginFooter()}>
                    <Link to="/" className="text-blue-600 hover:underline">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
