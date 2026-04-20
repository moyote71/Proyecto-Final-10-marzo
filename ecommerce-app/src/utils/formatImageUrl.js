const formatImageUrl = (url) => {
  const base = process.env.REACT_APP_API_BASE_URL?.replace("/api", "");

  if (!url || url.trim() === "") {
    return "https://placehold.co/800x600?text=Producto";
  }

  if (url.includes("localhost:5000")) {
    return url.replace("http://localhost:5000", base);
  }

  if (url.startsWith("/uploads")) {
    return `${base}${url}`;
  }

  return url;
};

export default formatImageUrl;
