import childModel from "../../../DB/model/child.model.js";
import parentModel from "../../../DB/model/parent.model.js";
import cloudinary from "../../services/cloudinary.js";
import {pagination} from "../../services/pagination.js"
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

export const getProfiles = async (req, res, next) => {
    try {
      const { skip, limit } = pagination(req.query.page, req.query.limit);
  
      // Clone and process the request body for query filtering
      let queryObj = { ...req.body };
  
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
      let mongooseQuery = childModel.find(queryObj).limit(limit).skip(skip);
  
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
      const count = await childModel.estimatedDocumentCount();
  
      // Return the response with paginated children profiles
      return res.json({
        message: 'success',
        page: children.length,
        total: count,
        children,
      });
    } catch (error) {
      // Pass any errors to the error handling middleware
      return next(error);
    }
  };
  export const getSpecificProfile = async (req, res) => {
    const child = await childModel.findById(req.params.childId);
    return res.status(200).json({ message: "success", child });
  };