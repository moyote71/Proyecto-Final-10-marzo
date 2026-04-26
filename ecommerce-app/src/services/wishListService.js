import { http } from "./http";

/* =========================
   GET
========================= */
export const getWishList = async () => {
  const res = await http.get("/wishlist");
  return res.data;
};

/* =========================
   ADD
========================= */
export const addToWishList = async (productId) => {
  const res = await http.post("/wishlist", { productId });
  return res.data;
};

/* =========================
   REMOVE
========================= */
export const removeFromWishList = async (productId) => {
  const res = await http.delete(`/wishlist/${productId}`);
  return res.data;
};

/* =========================
   MOVE TO CART (OPCIONAL)
========================= */
export const moveToCart = async (productId) => {
  // si ya tienes carrito:
  await http.post("/cart", { productId, quantity: 1 });

  // eliminar de wishlist
  await http.delete(`/wishlist/${productId}`);
};