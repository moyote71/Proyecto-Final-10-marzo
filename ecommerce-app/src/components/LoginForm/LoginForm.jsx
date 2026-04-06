import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import { loginContainer, loginCard, demoUsers, loginForm, loginFooter } from "./LoginFormStyles";

export default function LoginForm() {
    const { login } = useAuth();
    const {
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        submitError,
    } = useForm({
        initialValues: { email: "", password: "" },
        onSubmit: async (formValues) => {
            const result = await login(formValues.email, formValues.password);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    });

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

                <form className={loginForm()} onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        name="email"
                        label="Email:"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu email"
                        required
                    />

                    <Input
                        id="password"
                        name="password"
                        label="Contraseña:"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />

                    {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

                    <Button disabled={isSubmitting} type="submit" variant="primary">
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>

                <div className={loginFooter()}>
                    <Link to="/register" className="text-blue-600 hover:underline block mb-2">
                        ¿No tienes cuenta? Regístrate
                    </Link>
                    <Link to="/" className="text-gray-500 hover:underline block">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
