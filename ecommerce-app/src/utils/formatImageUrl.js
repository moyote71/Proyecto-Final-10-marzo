const formatImageUrl = (url) => {
  const base = process.env.REACT_APP_API_BASE_URL?.replace("/api", "");

  const fallback = "https://placehold.co/800x600?text=Producto";

  if (!url || typeof url !== "string") return fallback;

  const clean = url.trim();

  // ya es completa
  if (clean.startsWith("http")) return clean;

  // uploads correcto
  if (clean.startsWith("/uploads")) {
    return `${base}${clean}`;
  }

  if (clean.startsWith("uploads")) {
    return `${base}/${clean}`;
  }

  // fallback seguro
  return `${base}/${clean}`;
};

export default formatImageUrl;