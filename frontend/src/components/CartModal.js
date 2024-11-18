import React from 'react';
import '../styles/CartModal.css';

const CartModal = ({ cart, onClose, onRemoveFromCart, onUpdateQuantity }) => {
    return (
        <div className="cart-modal">
            <div className="cart-modal-content">
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cart.map((item) => (
                        <div key={item._id} className="cart-item">
                            <h4>{item.name}</h4>
                            <p>Price: ₹{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>
                                +
                            </button>
                            <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}>
                                -
                            </button>
                            <button onClick={() => onRemoveFromCart(item._id)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CartModal;
