import childModel from "../../../DB/model/child.model.js";
import drawingModel from "../../../DB/model/drawings.model.js";
import cloudinary from "../../services/cloudinary.js";
import {pagination} from "../../services/pagination.js"
export const createProfile=async(req,res,next)=>{
const {name,dateOfBirth,gender}=req.body;
if (!name || !dateOfBirth || !gender) {
 
}
const parentId=req.user._id;
const child = await childModel.findOne({ name, parentId }); 
if(child) {
  return res.status(409).json({message:'${name} already has a profile'});
}
let profilePic={};
if(req?.file?.path){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APP_NAME}/children`
        })
        
profilePic={secure_url,public_id};
}
const Child=await childModel.create({name,dateOfBirth,profilePic,parentId,gender})

return res.status(201).json({message:"success",Child});

}
export const getProfiles = async (req, res, next) => {
    try {
      const { skip, limit } = pagination(req.query.page, req.query.limit);
      const parentId = req.user._id;

      // Clone and process the request body for query filtering
      let queryObj = { ...req.body,parentId };
  
      // Fields to exclude from queryObj
      const execQuery = ['page', 'limit', 'skip', 'sort', 'search'];
      execQuery.forEach((field) => delete queryObj[field]);
  
      // Replace MongoDB operators (gt, gte, etc.) with their prefixed `$` versions
      queryObj = JSON.stringify(queryObj);
      queryObj = queryObj.replace(
        /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
        (match) => `$${match}`
      );
      queryObj = JSON.parse(queryObj);
  
      // Initialize the Mongoose query
      let mongooseQuery = childModel.find(queryObj).limit(limit).skip(skip).populate('drawings');
  
      // Add search functionality
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        mongooseQuery = mongooseQuery.find({
          $or: [
            { name: { $regex: searchRegex } },
            { gender: { $regex: searchRegex } }
          ],
        });
      }
  
      // Sort the query if the sort parameter exists
      const children = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' '));
  
      // Get the total document count
      const count = await childModel.countDocuments({parentId});
      const currentPage = parseInt(req.query.page, 10) || 1;
    
      // Return the response with paginated children profiles
      return res.json({
        message: 'success',
        page: currentPage,
        total: count,
        children,
      });
    } catch (error) {
      // Pass any errors to the error handling middleware
      return next(error);
    }
  };
export const getSpecificProfile = async (req, res) => {
    const child = await childModel.findById(req.params.childId).populate('drawings');
    return res.status(200).json({ message: "success", child });
  };
export const updateProfile = async (req, res, next) => {
    try {
      let updates = {};
      if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
          folder: `${process.env.APP_NAME}/children`,
        });
        const child = await childModel.findById(req.params.childId);
        if (child?.profilePic?.public_id) {
          await cloudinary.uploader.destroy(child.profilePic.public_id);
        }
        updates.profilePic = { secure_url, public_id };
      }
  
      if (req.body.dateOfBirth) {
        updates.dateOfBirth = req.body.dateOfBirth;
      }
      if (req.body.gender) {
        updates.gender = req.body.gender;
      }
      if (req.body.name) {
        const parentId=req.user._id;
        const child = await childModel.findOne({name:req.body.name, parentId }); 
        if(child) {
            return next(new Error(`There's child under the given name`, { cause: 409 }));
        }else{
          updates.name = req.body.name;

        }
      }
      const updatedUser = await childModel.findByIdAndUpdate(req.params.childId, updates, { new: true });
  
      return res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
export const deleteChild=async(req,res,next)=>{
    const childId=req.params.childId;
   const child = await childModel.findById(childId);
   if (!child) {
     return next(new Error(`Child not found`, { cause: 404 }));
   }
   if (child.profilePic?.public_id) {
     await cloudinary.uploader.destroy(child.profilePic.public_id);
   }
   await childModel.findOneAndDelete({ _id:childId });
   

   const drawings = await drawingModel.find({ childId });
   for (const drawing of drawings) {
     if (drawing.imageUrl?.public_id) {
       await cloudinary.uploader.destroy(drawing.imageUrl.public_id);
     }
   }
   await drawingModel.deleteMany({ childId });
   await childModel.findOneAndDelete({_id: childId });

      return res.status(200).json({ message: "Child profile and associated data deleted successfully" });
    
  };
