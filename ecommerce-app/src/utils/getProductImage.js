export default function getProductImage(product) {
    if (!product) return "https://placehold.co/800x600?text=Producto";

    if (Array.isArray(product.imagesUrl) && product.imagesUrl[0]) {
        return product.imagesUrl[0];
    }

    if (typeof product.image === "string") {
        return product.image;
    }

    return "https://placehold.co/800x600?text=Producto";
}