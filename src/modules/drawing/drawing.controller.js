import drawingModel from "../../../DB/model/drawings.model.js";
import cloudinary from "../../services/cloudinary.js";
import {pagination} from "../../services/pagination.js"

export const addDrawingPredict = async (req, res, next) => {
  try {
    const { prediction } = req.body;
    const { childId } = req.params;
    const parentId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required.' });
    }

    // Upload image to Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.APP_NAME}/drawings/${childId}`,
    });

    // Create the drawing record
    const drawing = await drawingModel.create({
      imageUrl: { secure_url, public_id },
      childId,
      parentId,
      prediction: JSON.parse(prediction), // Parse if prediction is sent as a JSON string
    });

    res.status(201).json({ message: 'Success', drawing });
  } catch (err) {
    next(err);
  }
};
export const getAllChildDrawings = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const {childId}=req.params;
  let queryObj = { ...req.body,childId };

  // Fields to exclude from queryObj
  const execQuery = ['page', 'limit', 'skip', 'sort'];
  execQuery.forEach((field) => delete queryObj[field]);

  // Replace MongoDB operators (gt, gte, etc.) with their prefixed `$` versions
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g, (match) => `$${match}`);
  queryObj = JSON.parse(queryStr);

  // Query the drawingModel with the constructed query object
  let mongooseQuery = drawingModel.find(queryObj).limit(limit).skip(skip).populate('childId');

  // Sort the query if the sort parameter exists
  const drawings = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' '));

  // Get the total document count
  const count = await drawingModel.countDocuments(queryObj);

  // Calculate the total number of pages
  const totalPages = Math.ceil(count / limit);
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Return the response with paginated drawings
  return res.json({
    message: 'success',
    page: currentPage,
    total: totalPages,
    count,
    drawings,
  });
};

export const getAllDrawings=async(req,res,next)=>{
  const { skip, limit } = pagination(req.query.page, req.query.limit);
      const parentId = req.user._id;

  let queryObj = { ...req.body,parentId};
  
  // Fields to exclude from queryObj
  const execQuery = ['page', 'limit', 'skip', 'sort'];
  execQuery.forEach((field) => delete queryObj[field]);

  // Replace MongoDB operators (gt, gte, etc.) with their prefixed `$` versions
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);
  let mongooseQuery = drawingModel.find(queryObj).limit(limit).skip(skip).populate('childId');


  // Sort the query if the sort parameter exists
  const drawings = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' '));

  // Get the total document count
  const count = await drawingModel.countDocuments({ parentId });
  const currentPage = parseInt(req.query.page, 10) || 1;

  // Return the response with paginated drawings
  return res.json({
    message: 'success',
    page: currentPage,
    total:count,
    drawings,
  });
};

export const getSpecificDrawing=async(req,res,nex)=>{
  const{childId,drawingId}=req.params;
  const parentId=req.user._id;
  const drawing=await drawingModel.findOne({_id:drawingId,parentId,childId});
  if (!drawing) {
    return res.status(404).json({
      message: "Drawing not found.",
    });
  }
  return res.status(200).json({message:"success",drawing});
}
export const deleteSpecificDrawing=async(req,res,next)=>{
const {childId,drawingId}=req.params;
const parentId=req.user._id;
const drawing = await drawingModel.findOneAndDelete({ _id: drawingId, childId, parentId });
if (!drawing) {
  return res.status(404).json({
    message: "Drawing not found.",
  });
}
return res.status(200).json({message:"Drawing deleted successfully"});
}
export const deleteAllDrawings=async(req,res,next)=>{
  const {childId}=req.params;
  const parentId=req.user._id;
  const drawings = await drawingModel.deleteMany({ childId, parentId });
  if (drawings.deletedCount === 0) {
    return res.status(404).json({
      message: "No drawings found for this child or you do not have permission to delete them.",
    });
  }

  return res.status(200).json({
    message: "All drawings for the specified child have been deleted successfully.",
    deletedCount: drawings.deletedCount,
  });
}