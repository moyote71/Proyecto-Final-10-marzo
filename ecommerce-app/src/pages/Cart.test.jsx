import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./Cart";
import * as CartContext from "../context/CartContext";
import '@testing-library/jest-dom';

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    BrowserRouter: ({ children }) => <div>{children}</div>
}), { virtual: true });

jest.mock("../context/CartContext", () => ({
    useCart: jest.fn()
}));

jest.mock("../components/Cart/CartView", () => () => <div data-testid="cart-view">CartViewMock</div>);

describe("Cart Page Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderCart = () => render(<Cart />);

    it("renders empty cart message when no items", () => {
        CartContext.useCart.mockReturnValue({
            cartItems: [],
            clearCart: jest.fn(),
            getTotalItems: () => 0,
            getTotalPrice: () => 0
        });

        renderCart();
        expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
        expect(screen.getByText(/continuar comprando/i)).toBeInTheDocument();
    });

    it("renders cart summary when items exist", () => {
        const mockClear = jest.fn();
        CartContext.useCart.mockReturnValue({
            cartItems: [{ _id: '1', name: 'Product', quantity: 2, price: 100 }],
            clearCart: mockClear,
            getTotalItems: () => 2,
            getTotalPrice: () => 200
        });

        renderCart();
        expect(screen.getByText(/carrito de compras/i)).toBeInTheDocument();
        expect(screen.getByText(/total a pagar/i)).toBeInTheDocument();
        expect(screen.getByText(/\$200.00/i)).toBeInTheDocument();
        expect(screen.getByTestId("cart-view")).toBeInTheDocument();
        
        fireEvent.click(screen.getByText(/vaciar carrito/i));
        expect(mockClear).toHaveBeenCalled();
    });
});
