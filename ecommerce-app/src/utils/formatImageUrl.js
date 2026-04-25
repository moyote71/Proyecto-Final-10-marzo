const API_URL = import.meta.env.VITE_API_URL;

export default function formatImageUrl(path) {
    if (!path) return "https://placehold.co/800x600?text=Producto";

    if (path.startsWith("http")) return path;

    return `${API_URL}${path}`;
}