import { createContext, useContext, useEffect, useReducer } from "react";
import {
    fetchCart,
    addToCartAPI,
    updateCartItemAPI,
    removeFromCartAPI,
    clearCartAPI,
} from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const ACTIONS = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
    UPDATE_QUANTITY: "UPDATE_QUANTITY",
    CLEAR_CART: "CLEAR_CART",
};

const initialState = {
    cartItems: [],
    loading: true,
    error: null,
};

function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, loading: true };

        case ACTIONS.FETCH_SUCCESS:
            return { ...state, loading: false, cartItems: action.payload };

        case ACTIONS.FETCH_ERROR:
            return { ...state, loading: false, error: action.payload };

        case ACTIONS.ADD_ITEM: {
            const { product, quantity } = action.payload;

            const exists = state.cartItems.find(
                (i) => i._id === product._id
            );

            if (exists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>
                        i._id === product._id
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    ),
                };
            }

            return {
                ...state,
                cartItems: [
                    ...state.cartItems,
                    { ...product, quantity },
                ],
            };
        }

        case ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (i) => i._id !== action.payload
                ),
            };

        case ACTIONS.UPDATE_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map((i) =>
                    i._id === action.payload.productId
                        ? { ...i, quantity: action.payload.quantity }
                        : i
                ),
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

    useEffect(() => {
        if (!user?._id) {
            dispatch({
                type: ACTIONS.FETCH_SUCCESS,
                payload: [],
            });
            return;
        }

        const loadCart = async () => {
            dispatch({ type: ACTIONS.FETCH_START });

            try {
                const cart = await fetchCart(user._id);

                const products = cart?.products || [];

                const normalized = products.map((p) => {
                    const product = p.product || {};
                    return {
                        ...product,
                        quantity: p.quantity,
                        _id: product._id,
                    };
                });

                dispatch({
                    type: ACTIONS.FETCH_SUCCESS,
                    payload: normalized,
                });
            } catch (err) {
                dispatch({
                    type: ACTIONS.FETCH_ERROR,
                    payload: err.message,
                });
            }
        };

        loadCart();
    }, [user]);

    const addToCart = async (product, quantity = 1) => {
        dispatch({
            type: ACTIONS.ADD_ITEM,
            payload: { product, quantity },
        });

        if (!user?._id) return;

        await addToCartAPI(user._id, product._id, quantity);
    };

    const removeFromCart = async (productId) => {
        dispatch({ type: ACTIONS.REMOVE_ITEM, payload: productId });

        if (!user?._id) return;

        await removeFromCartAPI(user._id, productId);
    };

    const updateQuantity = async (productId, quantity) => {
        dispatch({
            type: ACTIONS.UPDATE_QUANTITY,
            payload: { productId, quantity },
        });

        if (!user?._id) return;

        if (quantity <= 0) {
            await removeFromCartAPI(user._id, productId);
        } else {
            await updateCartItemAPI(user._id, productId, quantity);
        }
    };

    const clearCart = async () => {
        dispatch({ type: ACTIONS.CLEAR_CART });

        if (!user?._id) return;

        await clearCartAPI(user._id);
    };

    const getTotalPrice = () =>
        state.cartItems.reduce(
            (t, i) => t + (i.price || 0) * i.quantity,
            0
        );

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                loading: state.loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);