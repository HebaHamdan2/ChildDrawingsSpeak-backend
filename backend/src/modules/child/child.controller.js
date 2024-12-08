import childModel from "../../../DB/model/child.model.js";
import parentModel from "../../../DB/model/parent.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createProfile=async(req,res,next)=>{
const {name,dateOfBirth,gender}=req.body;
const child=await childModel.findOne({name});
if(child){
    return next(new Error(`${name} already has profile`,{cause:409}));
}
const parentId=req.user._id;
let profilePic=null;
if(req?.file?.path){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APP_NAME}/children`
        })
        
profilePic={secure_url,public_id};
}
const Child=await childModel.create({name,dateOfBirth,profilePic,parentId,gender})
await parentModel.findByIdAndUpdate(parentId, { $push: { children: Child._id } });

return res.status(201).json({message:"success",Child});

}
