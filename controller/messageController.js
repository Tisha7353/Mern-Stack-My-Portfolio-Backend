import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";

const sendMessage=catchAsyncErrors (async(req,res,next)=>{
    
    const {senderName,subject,message}=req.body;
    if(!senderName || !subject || !message){
        return next(new ErrorHandler("Please fill complete details",404))
    }
    const data = await Message.create({senderName,subject,message});
    res.status(200).json({
        success:true,
        message:"Message sent",
        data
    })
})
export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages
    })
})
export const deleteAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    const message=await Message.findById(id);
    if(!message){
        return next(new ErrorHandler("Message already deleted",400))
    }
    await message.deleteOne();
    res.status(200).json({
        success:true,
        message:"Message deleted"
    })
})
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check for empty fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    // Find the user and include the password field
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Compare the current password
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect current password", 400));
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("Confirmed password does not match", 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Respond with success message
    res.status(200).json({
        success: true,
        message: "Password Updated"
    });
});

export {sendMessage}