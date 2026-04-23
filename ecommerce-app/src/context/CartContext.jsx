import { createContext, useContext, useEffect, useReducer } from "react";
import { fetchCart, addToCartAPI, updateCartItemAPI, removeFromCartAPI, clearCartAPI } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const ACTIONS = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
    UPDATE_QUANTITY: "UPDATE_QUANTITY",
    CLEAR_CART: "CLEAR_CART"
};

export const initialState = {
    cartItems: [],
    loading: true,
    error: null
};

function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, loading: true, error: null };
        case ACTIONS.FETCH_SUCCESS:
            return { ...state, loading: false, cartItems: action.payload };
        case ACTIONS.FETCH_ERROR:
            return { ...state, loading: false, error: action.payload };
        case ACTIONS.ADD_ITEM: {
            const product = action.payload.product;
            const quantity = action.payload.quantity;
            const existing = state.cartItems.find(item => item._id === product._id);
            
            if (existing) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                };
            }
            return {
                ...state,
                cartItems: [...state.cartItems, { ...product, quantity }]
            };
        }
        case ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload)
            };
        case ACTIONS.UPDATE_QUANTITY:
            if (action.payload.quantity <= 0) {
                return {
                    ...state,
                    cartItems: state.cartItems.filter(item => item._id !== action.payload.productId)
                };
            }
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item._id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case ACTIONS.CLEAR_CART:
            return { ...state, cartItems: [] };
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();

    // Cargar el carrito desde la API en el primer montaje
    useEffect(() => {
        const loadCart = async () => {
            dispatch({ type: ACTIONS.FETCH_START });
            try {
                const cart = await fetchCart(user?._id);
                // Normalizar estructura de la base de datos a lo que usa la UI frontend
                if (cart && cart.products) {
                    const normalizedItems = cart.products.map(p => ({
                        ...(p.product || {}),
                        quantity: p.quantity,
                        _id: (p.product?._id || p.product || "").toString()
                    }));
                    dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: normalizedItems });
                } else {
                    dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: [] });
                }
            } catch (error) {
                console.error("Error cargando carrito", error);
                dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
            }
        };
        loadCart();
    }, [user]);

    const addToCart = async (product, quantity = 1) => {
        // Optimistic UI update
        dispatch({ type: ACTIONS.ADD_ITEM, payload: { product, quantity } });

        // API Call
        try {
            await addToCartAPI(user?._id, product._id, quantity);
        } catch (error) {
            console.error("Error al añadir al carrito en BD", error);
        }
    };

    const removeFromCart = async (productId) => {
        // Optimistic UI
        dispatch({ type: ACTIONS.REMOVE_ITEM, payload: productId });
        
        // API Call
        try {
            await removeFromCartAPI(user?._id, productId);
        } catch (error) {
            console.error("Error al eliminar del carrito en BD", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        // Optimistic UI
        dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity: newQuantity } });

        // API Call
        try {
            if (newQuantity <= 0) {
                await removeFromCartAPI(user?._id, productId);
            } else {
                await updateCartItemAPI(user?._id, productId, newQuantity);
            }
        } catch (error) {
            console.error("Error al actualizar cantidad en BD", error);
        }
    };

    const clearCart = async () => {
        dispatch({ type: ACTIONS.CLEAR_CART });
        try {
            await clearCartAPI(user?._id);
        } catch (error) {
            console.error("Error limpiando carrito en BD", error);
        }
    };

    const getTotalItems = () =>
        state.cartItems.reduce((total, item) => total + item.quantity, 0);

    const getTotalPrice = () =>
        state.cartItems.reduce(
            (total, item) => total + (item.price || 0) * item.quantity,
            0
        );

    const value = {
        cartItems: state.cartItems,
        loading: state.loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context)
        throw new Error("useCart debe ser usado dentro de CartProvider");
    return context;
}
