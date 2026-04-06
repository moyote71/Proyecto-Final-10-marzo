import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import { registerContainer, registerCard, registerForm, registerFooter } from "./RegisterFormStyles";

// Expresión regular para validación básica de email
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
    const { register } = useAuth();
    
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        submitError,
    } = useForm({
        initialValues: { name: "", email: "", password: "", confirmPassword: "" },
        validate: (vals) => {
            const errs = {};
            if (!vals.name.trim() || !vals.email.trim() || !vals.password || !vals.confirmPassword) {
                errs.general = "Todos los campos son obligatorios.";
            } else {
                if (!REGEX_EMAIL.test(vals.email)) {
                    errs.email = "El formato del correo es inválido.";
                }
                if (vals.password.length < 6) {
                    errs.password = "La contraseña debe tener al menos 6 caracteres.";
                }
                if (vals.password !== vals.confirmPassword) {
                    errs.confirmPassword = "Las contraseñas no coinciden.";
                }
            }
            return errs;
        },
        onSubmit: async (vals) => {
            const result = await register(vals.name, vals.email, vals.password);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    });

    const displayError = submitError || errors.general || errors.email || errors.password || errors.confirmPassword;

    return (
        <div className={registerContainer()}>
            <div className={registerCard()}>
                <h2 className="text-2xl font-semibold mb-2 text-center">Crear Cuenta</h2>
                <p className="text-gray-500 text-center mb-4 text-sm">Regístrate para comprar y revisar tu historial de pedidos.</p>

                <form className={registerForm()} onSubmit={handleSubmit}>
                    <Input
                        id="name"
                        name="name"
                        label="Nombre completo:"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />

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
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                    
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirmar contraseña:"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        placeholder="Vuelve a escribir la contraseña"
                        required
                    />

                    {displayError && <ErrorMessage>{displayError}</ErrorMessage>}

                    <Button disabled={isSubmitting} type="submit" variant="primary">
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creando cuenta...
                            </span>
                        ) : "Regístrate"}
                    </Button>
                </form>

                <div className={registerFooter()}>
                    <Link to="/login" className="text-blue-600 hover:underline block mb-2">
                        ¿Ya tienes cuenta? Inicia sesión
                    </Link>
                    <Link to="/" className="text-gray-500 hover:underline block">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
