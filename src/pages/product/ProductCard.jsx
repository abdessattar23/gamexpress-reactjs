import { useState } from 'react';
import '../../assets/style/ProductCard.css';

const ProductCard = ({ product, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(product.id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(product.id, newQuantity);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/images/placeholder-product.jpg'} alt={product.name} />
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}/unit</p>
        
        <div className="quantity-controls">
          <button 
            onClick={handleDecrease} 
            className="quantity-btn"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            onClick={handleIncrease} 
            className="quantity-btn"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="product-total">
        <p>${(product.price * quantity).toFixed(2)}</p>
        <button 
          onClick={() => onRemove(product.id)} 
          className="remove-btn"
          aria-label="Remove product"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ProductCard;