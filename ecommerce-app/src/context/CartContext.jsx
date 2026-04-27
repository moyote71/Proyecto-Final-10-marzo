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

/* =========================
   ACTIONS
========================= */
export const ACTIONS = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",

    ADD_ITEM_OPTIMISTIC: "ADD_ITEM_OPTIMISTIC",
    REMOVE_ITEM_OPTIMISTIC: "REMOVE_ITEM_OPTIMISTIC",
    UPDATE_QUANTITY_OPTIMISTIC: "UPDATE_QUANTITY_OPTIMISTIC",
    CLEAR_CART: "CLEAR_CART",

    REVERT_CART: "REVERT_CART",
};

/* =========================
   STATE
========================= */
const initialState = {
    cartItems: [],
    loading: true,
    error: null,
};

/* =========================
   REDUCER
========================= */
function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, loading: true, error: null };

        case ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                cartItems: action.payload,
                error: null,
            };

        case ACTIONS.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case ACTIONS.ADD_ITEM_OPTIMISTIC: {
            const { product, quantity } = action.payload;

            const exists = state.cartItems.find(
                (i) => i._id === product._id
            );

            if (exists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>
                        i._id === product._id
                            ? {
                                  ...i,
                                  quantity: i.quantity + quantity,
                              }
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

        case ACTIONS.REMOVE_ITEM_OPTIMISTIC:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (i) => i._id !== action.payload
                ),
            };

        case ACTIONS.UPDATE_QUANTITY_OPTIMISTIC:
            return {
                ...state,
                cartItems: state.cartItems
                    .map((i) =>
                        i._id === action.payload.productId
                            ? {
                                  ...i,
                                  quantity: action.payload.quantity,
                              }
                            : i
                    )
                    .filter((i) => i.quantity > 0),
            };

        case ACTIONS.CLEAR_CART:
            return {
                ...state,
                cartItems: [],
            };

        case ACTIONS.REVERT_CART:
            return {
                ...state,
                cartItems: action.payload,
            };

        default:
            return state;
    }
}

/* =========================
   PROVIDER
========================= */
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user } = useAuth();

    /* =========================
       LOAD CART (TOKEN BASED)
    ========================= */
    useEffect(() => {
        if (!user) {
            dispatch({
                type: ACTIONS.FETCH_SUCCESS,
                payload: [],
            });
            return;
        }

        const loadCart = async () => {
            dispatch({ type: ACTIONS.FETCH_START });

            try {
                const cart = await fetchCart();

                const products = cart?.products ?? [];

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

    /* =========================
       ADD TO CART
    ========================= */
    const addToCart = async (product, quantity = 1) => {
        dispatch({
            type: ACTIONS.ADD_ITEM_OPTIMISTIC,
            payload: { product, quantity },
        });

        if (!user) return;

        try {
            await addToCartAPI(product._id, quantity);
        } catch (err) {
            console.error("Add to cart failed:", err);
        }
    };

    /* =========================
       REMOVE
    ========================= */
    const removeFromCart = async (productId) => {
        const backup = state.cartItems;

        dispatch({
            type: ACTIONS.REMOVE_ITEM_OPTIMISTIC,
            payload: productId,
        });

        if (!user) return;

        try {
            await removeFromCartAPI(productId);
        } catch (err) {
            dispatch({
                type: ACTIONS.REVERT_CART,
                payload: backup,
            });
        }
    };

    /* =========================
       UPDATE
    ========================= */
    const updateQuantity = async (productId, quantity) => {
        const backup = state.cartItems;

        dispatch({
            type: ACTIONS.UPDATE_QUANTITY_OPTIMISTIC,
            payload: { productId, quantity },
        });

        if (!user) return;

        try {
            if (quantity <= 0) {
                await removeFromCartAPI(productId);
            } else {
                await updateCartItemAPI(productId, quantity);
            }
        } catch (err) {
            dispatch({
                type: ACTIONS.REVERT_CART,
                payload: backup,
            });
        }
    };

    /* =========================
       CLEAR
    ========================= */
    const clearCart = async () => {
        const backup = state.cartItems;

        dispatch({ type: ACTIONS.CLEAR_CART });

        if (!user) return;

        try {
            await clearCartAPI();
        } catch (err) {
            dispatch({
                type: ACTIONS.REVERT_CART,
                payload: backup,
            });
        }
    };

    /* =========================
       TOTALS
    ========================= */
    const getTotalPrice = () =>
        state.cartItems.reduce(
            (t, i) => t + (i.price || 0) * i.quantity,
            0
        );

    const getTotalItems = () =>
        state.cartItems.reduce((t, i) => t + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                loading: state.loading,
                error: state.error,

                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,

                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);