import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Paper,
    Box,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, updateCartItem, removeFromCart } = useCart();

    // Redirect to store if the cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/store');
        }
    }, [cart, navigate]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add items before proceeding to checkout.');
            navigate('/store');
        } else {
            navigate('/checkout');
        }
    };

    const handleContinueShopping = () => {
        navigate('/store');
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>

            {cart.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    Your cart is empty. Redirecting to the store...
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Details</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Total</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item._id}>
                                    {/* Product Image */}
                                    <TableCell>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </TableCell>

                                    {/* Product Details */}
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.size}
                                        </Typography>
                                    </TableCell>

                                    {/* Quantity Controls */}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    item.quantity > 1
                                                        ? updateCartItem(item._id, item.quantity - 1)
                                                        : removeFromCart(item._id)
                                                }
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography variant="body1" sx={{ mx: 2 }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton
                                                color="primary"
                                                onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell>₹{item.price}</TableCell>

                                    {/* Total for This Item */}
                                    <TableCell>₹{item.price * item.quantity}</TableCell>

                                    {/* Remove Button */}
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Cart Summary */}
            {cart.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 3,
                    }}
                >
                    <Typography variant="h5">
                        Total: ₹{calculateTotal()}
                    </Typography>
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            sx={{ marginRight: 2 }}
                        >
                            Proceed to Checkout
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleContinueShopping}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CartPage;
