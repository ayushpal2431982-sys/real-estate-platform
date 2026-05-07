import Whishlist from "../models/wishlist.models.js";


//to add property to Whishlist
export const addWhishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;

        const existing = await Whishlist.findOne({
            user: req.user._id,
            property: propertyId
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Already in wishlist"
            });
        }

        await Whishlist.create({
            user: req.user._id,
            property: propertyId
        });

        res.status(201).json({
            success: true,
            message: "Added to wishlist"
        });
    } 
    
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//to get the property that is in whsishlist
export const getWhishlist = async (req, res) => {
    try {
        const data = await Whishlist.find({
            user: req.user._id
        }).populate("property");

        res.status(200).json(data);
    } 
    
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });        
    }
}

//to remove a property from whislist
export const removeWhishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const result = await Whishlist.findOneAndDelete({
            user: req.user._id,
            property: propertyId
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Property not found in wishlist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Removed from wishlist"
        });
    } 
    
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });      
    }
}