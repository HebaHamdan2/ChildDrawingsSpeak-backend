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
export const getAllDrawings=async(req,res,next)=>{
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    const {childId}=req.params;
    let queryObj = { ...req.body,childId };
  
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
    let mongooseQuery = drawingModel.find(queryObj).limit(limit).skip(skip);
  

    // Sort the query if the sort parameter exists
    const children = await mongooseQuery.sort(req.query.sort?.replaceAll(',', ' '));

    // Get the total document count
    const count = await drawingModel.estimatedDocumentCount();

    // Return the response with paginated children profiles
    return res.json({
      message: 'success',
      page: children.length,
      total: count,
      children,
    });
  
}
