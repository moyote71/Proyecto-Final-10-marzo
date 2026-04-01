import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
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

const mockRegister = jest.fn();

describe("RegisterForm Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AuthContextModule.useAuth.mockReturnValue({
            register: mockRegister
        });
    });

    const renderRegisterForm = () => render(<RegisterForm />);

    it("renders the register form correctly", () => {
        renderRegisterForm();
        expect(screen.getByRole("heading", { name: /crear cuenta/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /regístrate/i })).toBeInTheDocument();
    });

    it("muestra error por campos obligatorios vacíos", async () => {
        renderRegisterForm();
        fireEvent.click(screen.getByRole("button", { name: /regístrate/i }));

        await waitFor(() => {
            expect(screen.getByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    it("muestra error con email inválido", async () => {
        renderRegisterForm();
        
        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { name: "name", value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { name: "email", value: "correo-invalido" } });
        fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { name: "password", value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { name: "confirmPassword", value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /regístrate/i }));

        await waitFor(() => {
            expect(screen.getByText(/formato del correo es inválido/i)).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    it("muestra error con password mismatch", async () => {
        renderRegisterForm();
        
        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { name: "name", value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { name: "email", value: "test@correo.com" } });
        fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { name: "password", value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { name: "confirmPassword", value: "password456" } });

        fireEvent.click(screen.getByRole("button", { name: /regístrate/i }));

        await waitFor(() => {
            expect(screen.getByText(/contraseñas no coinciden/i)).toBeInTheDocument();
            expect(mockRegister).not.toHaveBeenCalled();
        });
    });

    it("llama a register de manera exitosa y maneja estado de carga", async () => {
        mockRegister.mockResolvedValueOnce({ success: true });

        renderRegisterForm();
        
        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { name: "name", value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { name: "email", value: "test@correo.com" } });
        fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { name: "password", value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { name: "confirmPassword", value: "password123" } });

        const submitBtn = screen.getByRole("button", { name: /regístrate/i });
        fireEvent.click(submitBtn);

        // El UI debe cambiar a reenderizar un spinner o mensaje "creando cuenta..."
        expect(screen.getByRole("button", { name: /creando cuenta/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /creando cuenta/i })).toBeDisabled();

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith("Test User", "test@correo.com", "password123");
        }, { timeout: 2500 });
    });

    it("muestra error si el backend falla", async () => {
        mockRegister.mockResolvedValue({ success: false, error: "El correo ya está en uso" });

        renderRegisterForm();
        
        fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@correo.com" } });
        fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { value: "password123" } });
        fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /regístrate/i }));

        await waitFor(() => {
            console.log("DOM during wait:", screen.debug(undefined, 300000));
            expect(screen.getByText(/correo ya está en uso/i)).toBeInTheDocument();
        }, { timeout: 2500 });
    });
});
