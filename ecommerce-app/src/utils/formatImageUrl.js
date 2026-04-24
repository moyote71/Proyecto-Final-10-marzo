const formatImageUrl = (url) => {
  const base = process.env.REACT_APP_API_BASE_URL?.replace("/api", "");

  // 🔥 Si no hay URL válida, fallback seguro
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "https://placehold.co/800x600?text=Producto";
  }

  const cleanUrl = url.trim();

  // 🔥 Si ya es URL absoluta, no tocarla
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  // 🔥 Si viene de uploads (backend típico)
  if (cleanUrl.startsWith("/uploads")) {
    return `${base}${cleanUrl}`;
  }

  // 🔥 Si viene sin slash inicial
  if (cleanUrl.startsWith("uploads")) {
    return `${base}/${cleanUrl}`;
  }

  // 🔥 fallback general
  return `${base}/${cleanUrl}`;
};

export default formatImageUrl;