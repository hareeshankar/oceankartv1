import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { cart, addToCart, updateCartItem, removeFromCart } = useCart();

    // Check if the product is already in the cart
    const cartItem = cart.find((item) => item._id === product._id);

    return (
        <Card sx={{ maxWidth: 300, margin: 2, position: 'relative' }}>
            {/* Product Image */}
            <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
            />

            {/* Product Details */}
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.weight}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                    ₹{product.price}
                </Typography>
            </CardContent>

            {/* Actions (Add/Remove Buttons and Quantity Display) */}
            <CardActions>
                {cartItem ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        {/* Remove Button */}
                        <IconButton
                            onClick={() =>
                                cartItem.quantity > 1
                                    ? updateCartItem(product._id, cartItem.quantity - 1)
                                    : removeFromCart(product._id)
                            }
                            color="error"
                        >
                            <RemoveIcon />
                        </IconButton>

                        {/* Quantity Display */}
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {cartItem.quantity}
                        </Typography>

                        {/* Add Button */}
                        <IconButton
                            onClick={() => updateCartItem(product._id, cartItem.quantity + 1)}
                            color="primary"
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <IconButton
                            onClick={() => addToCart({ ...product, quantity: 1 })}
                            color="primary"
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                )}
            </CardActions>
        </Card>
    );
};

export default ProductCard;
