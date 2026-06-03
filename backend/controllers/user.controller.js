import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// get profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success: true,
            user
        });
    } 
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Public Profile
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name profilePic role createdAt");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } 
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });  
    }
}

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, removeProfilePic } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Image handling
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, "profiles");
                user.profilePic = result.secure_url;
            } catch (uploadErr) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed: " + uploadErr.message
                });
            }
        } else if (removeProfilePic === "true") {
            user.profilePic = null;
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;

        await user.save();
        const cleanUser = await User.findById(user._id).select("-password");

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: cleanUser
        });
    } 
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });  
    }
}