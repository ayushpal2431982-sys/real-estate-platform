import Inquiry from "../models/inquiry.model.js";
import Property from "../models/property.model.js"; // ✅ Fix 1: uppercase Property

// buyer send inquiry
export const sendInquiry = async (req, res) => {
    try {
        const { propertyId, message } = req.body;
        const foundProperty = await Property.findById(propertyId).populate("seller"); // ✅ Fix 2: renamed to foundProperty

        if (!foundProperty) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const inquiry = await Inquiry.create({
            property: foundProperty._id,
            buyer: req.user._id,
            seller: foundProperty.seller._id,
            message
        });

        res.status(201).json({
            success: true,
            message: "Inquiry sent successfully",
            inquiry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// seller view inquiries
export const getSellerInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({
            seller: req.user._id
        })
        .populate("buyer", "name email phone")
        .populate("property", "title price images city")
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inquiries.length,
            inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// mark inquiry as read
export const markAsRead = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found"
            });
        }

        inquiry.isRead = true;
        await inquiry.save();

        res.json({
            success: true,
            message: "Inquiry marked as read"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}