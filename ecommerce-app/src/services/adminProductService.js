import { http } from "./http";

/* =========================
   GET ALL PRODUCTS (ADMIN)
========================= */
export const getAllProductsAdmin = async () => {
    const res = await http.get("/products");
    return res.data?.products || res.data || [];
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (productData) => {
    const res = await http.post("/products", productData);
    return res.data;
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (id, productData) => {
    const res = await http.put(`/products/${id}`, productData);
    return res.data;
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (id) => {
    const res = await http.delete(`/products/${id}`);
    return res.data;
};