export const formatImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/800x600";

  if (url.includes("localhost:5000")) {
    return url.replace(
      "http://localhost:5000",
      process.env.REACT_APP_API_BASE_URL?.replace("/api", "") || ""
    );
  }

  if (url.startsWith("/uploads")) {
    return `${process.env.REACT_APP_API_BASE_URL?.replace("/api", "") || ""}${url}`;
  }

  return url;
};
