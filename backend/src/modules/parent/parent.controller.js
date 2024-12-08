import childModel from "../../../DB/model/child.model.js";
import drawingModel from "../../../DB/model/drawings.model.js";
import parentModel from "../../../DB/model/parent.model.js";
import cloudinary from "../../services/cloudinary.js";
import bcrypt from "bcryptjs";
export const profile=async(req,res,next)=>{
    const user=await parentModel.findById(req.user._id);
    return res.status(200).json({message:"success",user});
}
export const updateProfile = async (req, res, next) => {
    try {
      let updates = {};
  
      // Handle profile picture upload
      if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/user/${req.user._id}/profile`,
        });
  
        // Get the current user's profile
        const user = await parentModel.findById(req.user._id);
  
        // If an existing profile picture exists, delete it
        if (user?.profilePic?.public_id) {
          await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
  
        // Prepare the update for the profile picture
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
            return next(new Error("Invalid old password"));
        }
        const hashPassword=bcrypt.hashSync(newPassword,parseInt(process.env.SALTROUND));
        user.password=hashPassword;
        user.save();
        return res.status(200).json({message:"success"});
    }
export const deleteAccount=async(req,res,next)=>{
  const parentId=req.user._id;
  const parent=await parentModel.findByIdAndDelete(parentId)
if(!parent){
  return next(new Error(`parent not found`,{cause:404}))
}
  await drawingModel.deleteMany({ parentId });
  await childModel.deleteMany({ parentId });

    return res.status(200).json({ message: "Parent account and associated data deleted successfully" });
  
};