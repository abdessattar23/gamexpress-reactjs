import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const defaultImage =
    "https://placehold.co/300x300/6366f1/fff?text=GameXpress";
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage = product.images.find((img) => img.is_primary === 1);
  const firstImage = product.images[0];
  const imageUrl = primaryImage?.image_url || firstImage?.image_url;

  const handleAddToCart = async () => {
    if (loading || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product, product.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-[300px] h-[380px] mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-[200px] w-full bg-gray-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-contain transition-transform duration-500 ease-in-out hover:scale-105"
          style={{
            backgroundImage: `url(${
              imageUrl
                ? `http://localhost:8000/storage/${imageUrl}`
                : defaultImage
            })`,
          }}
        ></div>

        <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-1 rounded-md text-sm font-bold shadow-md">
          ${product.price}
        </div>

        {product.stock <= 10 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="p-4 h-[180px] flex flex-col justify-between">
        <div className="h-[100px]">
          <h3
            className="text-lg font-semibold mb-2 truncate h-8"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm h-[4.2em] overflow-hidden line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between gap-4 pt-4 border-t border-gray-200">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 py-2 px-4 bg-white border border-indigo-600 text-indigo-600 rounded-md text-center text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || loading || product.stock === 0}
            className={`flex-1 py-2 px-4 ${
              isAdding || loading
                ? "bg-indigo-400"
                : product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span>
              {isAdding
                ? "Adding..."
                : product.stock === 0
                ? "Sold Out"
                : "Add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
