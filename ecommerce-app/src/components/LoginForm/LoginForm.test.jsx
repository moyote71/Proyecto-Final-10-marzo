import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import * as AuthContextModule from "../../context/AuthContext";
import '@testing-library/jest-dom';

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>
}), { virtual: true });

jest.mock("../../context/AuthContext", () => ({
    useAuth: jest.fn()
}));

const mockLogin = jest.fn();

describe("LoginForm Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AuthContextModule.useAuth.mockReturnValue({
            login: mockLogin
        });
    });

    const renderLoginForm = () => render(<LoginForm />);

    it("renders the login form correctly", () => {
        renderLoginForm();
        // The form has a heading text "Iniciar Sesión" and a button "Iniciar Sesión"
        expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    it("muestra error si los campos están vacíos (falla validación HTML5)", async () => {
        renderLoginForm();
        const submitBtn = screen.getByRole("button", { name: /iniciar sesión/i });
        // En un form nativo, required prevendrá el submit, pero programáticamente verificaremos que login no se llame
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });
    
    it("muestra error en credenciales incorrectas", async () => {
        mockLogin.mockResolvedValue({ success: false, error: "Credenciales inválidas" });
        
        renderLoginForm();
        
        fireEvent.change(screen.getByLabelText(/email/i), { target: { name: "email", value: "test@test.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { name: "password", value: "wrong" } });
        
        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
        }, { timeout: 2500 });
    });

    it("calls login function on submit with correct values", async () => {
        mockLogin.mockResolvedValue({ success: true, user: { name: 'Test' } });
        
        renderLoginForm();
        
        fireEvent.change(screen.getByLabelText(/email/i), { target: { name: "email", value: "test@test.com" } });
        fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { name: "password", value: "password123" } });
        
        fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
        }, { timeout: 2500 });
    });
});
