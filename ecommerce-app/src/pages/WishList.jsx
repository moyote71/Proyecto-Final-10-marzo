import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishList, removeFromWishList, moveToCart } from "../services/wishListService";
import ProductCard from "../components/ProductCard/ProductCard";
import { isAuthenticated } from "../utils/auth";
import Button from "../components/common/Button";

export default function WishList() {
    const queryClient = useQueryClient();
    
    const { data: wishlist = [], isLoading, error } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishList,
        enabled: isAuthenticated()
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWishList,
        onSuccess: () => queryClient.invalidateQueries(["wishlist"])
    });

    const moveMutation = useMutation({
        mutationFn: moveToCart,
        onSuccess: () => queryClient.invalidateQueries(["wishlist"])
    });

    if (!isAuthenticated()) {
        return <div className="p-8 text-center text-gray-600">Debes iniciar sesión para ver tu lista de deseos.</div>;
    }

    if (isLoading) return <div className="p-8 text-center text-gray-600">Cargando tu lista de deseos...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error cargando lista de deseos.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Lista de Deseos</h1>
            {wishlist.length === 0 ? (
                <p className="text-gray-600">Tu lista está vacía. Sumá productos que te gusten.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => {
                        const product = item.product || item;
                        return (
                            <div key={product._id} className="relative shadow-sm rounded-lg border p-2">
                                <ProductCard product={product} />
                                <div className="mt-4 flex flex-col gap-2 relative z-10 bg-white p-2">
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        onClick={() => moveMutation.mutate(product._id)}
                                        disabled={moveMutation.isPending}
                                    >
                                        🛒 Mover al Carrito
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => removeMutation.mutate(product._id)}
                                        disabled={removeMutation.isPending}
                                    >
                                        ❌ Eliminar
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
