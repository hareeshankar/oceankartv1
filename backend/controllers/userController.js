const User = require('../models/User');

// Get User Address
const getUserAddress = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ address: user.address });
  } catch (error) {
    console.error('Error retrieving user address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is attached to req.user by the auth middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      address: user.address,
    });
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Details
const updateUserDetails = async (req, res) => {
  try {
    const { userId, email, address } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email if provided
    if (email) {
      user.email = email;
    }

    // Update address if provided
    if (address) {
      user.address = {
        ...user.address, // Retain existing fields
        ...address, // Overwrite with new fields
      };
    }

    // Save the updated user details
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User details updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserAddress, getUserDetails, updateUserDetails };
