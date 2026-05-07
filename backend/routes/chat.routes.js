import express from 'express';
import Chat from '../models/chat.model.js';
import { protect } from '../middlewares/auth.middleware.js';

const chatRouter = express.Router();

chatRouter.use(protect);

// to create a chat
chatRouter.post("/start", async (req,res) => {
    try {
        const { propertyId, sellerId, buyerId: providedBuyerId } = req.body;
        let buyerId, finalSellerId;
        if (req.user.role === "seller") {
            buyerId = providedBuyerId;
            finalSellerId = req.user._id;
        }else{
            buyerId = req.user._id;
            finalSellerId = sellerId
        }

        if (!buyerId || !finalSellerId) {
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            });
        }

        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId
        });

        if (!chat) {
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                message: []
            });
        }

        chat = await Chat.findById(chat._id)
        .populate("buyer", "name email profilePic")
        .populate("seller", "name email profilePic")
        .populate("property", "title price image");
        res.json(chat);
    } 
    
    catch (err) {
        res.status(500).json({
            message: "Error creating chat or getting previous one",
            error: err.message
        });
    } 
})

//to send a message
chatRouter.post("/send", async (req,res) => {
    try {
        const { chatId, text, image } = req.body;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({
            message: "chat not found"
        });

        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
            message: "Not authorized to send messages in this chat"
            });    
        }
        const newMessage = {
            sender: userId,
            text,
            image,
            createdAt: new Data()
        };
        chat.messages.push(newMessage);
        await chat.save();

        const saveMessage = chat.messages[chat.messages.length - 1];
        res.json({ chat, newMessage: savedMessage });
    } 
    
    catch (err) {
        res.status(500).json({
            message: "Error sending message",
            error: err.message
        });
    }
})

//to get chats for user
chatRouter.get("/user", async (req,res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [{ buyer: userId}, { seller: userId}]
        })
        .populate("buyer", "name email profilePic")
        .populate("seller", "name email profilePic")
        .populate("property", "title price image")
        .sort({ updatedAt: -1 });

        res.json(chats);
    } 
    
    catch (err) {
        res.status(500).json({
            message: "Error fetching user chats",
            error: err.message
        });      
    }  
});

//to get chat message
chatRouter.get("/:chatId", async (req,res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "message.sender",
            "nameprofilePic"
        );

        if (!chat) return res.status(404).json({message: "chat not found"});

        const userId = req.user._id.toString();
        if(chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized"
            });
        }
        res.json(chat);
    } 
    
    catch (err) {
        res.status(500).json({
            message: "Error fetching chat messages",
            error: err.message
        });  
    }
})

// to delete an entire chat
chatRouter.delete("/chatId", async (req,res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({message: "chat not found"});

        if (
            chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString() 
        ) {
            return res.status(403).json({ message: "Not Authorized"});
        }
        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message : "Chat deleted successfully"});
    } 

    catch (err) {
        res.status(500).json({
            message: "Error fetching chat messages",
            error: err.message
        });    
    }   
});

//to delete a specific message
chatRouter.delete("/:chatId/message/:messageId", async (req,res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return res.status(404).json({message: "chat not found"});

        const message = chat.messages.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: "Message not found"});

        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Not Authorized to delete this message"
            });
        }

        chat.message.pull(req.params.messageId);
        await chat.save();
        res.json({ message: "Message deleted successfully!", chat});
    } 
    
    catch (err) {
        res.status(500).json({
            message: "Error fetching chat messages",
            error: err.message
        });      
    }
});

export default chatRouter;