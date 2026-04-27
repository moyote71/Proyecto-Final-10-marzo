import { useState } from "react";
import getProductImage from "../../utils/getProductImage";

export default function ProductDetailsCard({ product }) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!product) return null;

    const images = Array.isArray(product.imagesUrl)
        ? product.imagesUrl
        : product.imagesUrl
        ? [product.imagesUrl]
        : [];

    const mainImage =
        images[selectedImage] || getProductImage(product);

    return (
        <div className="flex flex-col md:flex-row gap-6">

            {/* IMAGEN PRINCIPAL */}
            <div className="flex-1">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-[400px] object-cover rounded-lg border"
                    onError={(e) =>
                        (e.target.src =
                            "https://placehold.co/800x600?text=Producto")
                    }
                />

                {/* MINI GALERÍA */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-3">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setSelectedImage(index)}
                                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                                    selectedImage === index
                                        ? "border-blue-500"
                                        : "border-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* INFO */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold">{product.name}</h1>

                <p className="text-gray-600 mt-2">
                    {product.description}
                </p>

                <p className="text-xl font-bold mt-4">
                    ${product.price}
                </p>

                <p className="mt-2">
                    Stock: {product.stock}
                </p>
            </div>
        </div>
    );
}