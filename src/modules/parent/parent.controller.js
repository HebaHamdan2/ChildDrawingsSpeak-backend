import childModel from "../../../DB/model/child.model.js";
import drawingModel from "../../../DB/model/drawings.model.js";
import parentModel from "../../../DB/model/parent.model.js";
import cloudinary from "../../services/cloudinary.js";
import bcrypt from "bcryptjs";
export const getAccountInfo=async(req,res,next)=>{
  const parent = await parentModel.findById(req.user._id).populate('children')
    return res.status(200).json({message:"success",parent});
}
export const updateAccount = async (req, res, next) => {
    try {
      let updates = {};
      if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/user/${req.user._id}/profile`,
        });
        const user = await parentModel.findById(req.user._id);
        if (user?.profilePic?.public_id) {
          await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
        updates.profilePic = { secure_url, public_id };
      }
  
      // Handle address update
      if (req.body.address) {
        updates.address = req.body.address;
      }
  
      // Handle username update
      if (req.body.username) {
        updates.username = req.body.username;
      }
  
      // Apply updates to the user
      const updatedUser = await parentModel.findByIdAndUpdate(req.user._id, updates, { new: true });
  
      // Respond with the updated user data
      return res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
 export const updatePassword=async(req,res,next)=>{
        const {oldPassword,newPassword}=req.body;
        const user=await parentModel.findById(req.user._id);
        const match=bcrypt.compareSync(oldPassword,user.password);
        if(!match){
          return res.status(400).json({message:"Invalid old password"});
        }
        const hashPassword=bcrypt.hashSync(newPassword,parseInt(process.env.SALTROUND));
        user.password=hashPassword;
        user.save();
        return res.status(200).json({message:"success"});
    }
export const deleteAccount=async(req,res,next)=>{
  const parentId=req.user._id;
 const parent = await parentModel.findById(parentId);
 if (!parent) {
   return next(new Error(`Parent not found`, { cause: 404 }));
 }
 if (parent.profilePic?.public_id) {
   await cloudinary.uploader.destroy(parent.profilePic.public_id);
 }
 const children = await childModel.find({ parentId });

 for (const child of children) {
   if (child.profilePic?.public_id) {
     await cloudinary.uploader.destroy(child.profilePic.public_id);
   }
 }

 const drawings = await drawingModel.find({ parentId });
 for (const drawing of drawings) {
   if (drawing.imageUrl?.public_id) {
     await cloudinary.uploader.destroy(drawing.imageUrl.public_id);
   }
 }
 await drawingModel.deleteMany({ parentId });
 await childModel.deleteMany({ parentId });
 await parentModel.findByIdAndDelete(parentId);


    return res.status(200).json({ message: "Parent account and associated data deleted successfully" });
  
};
