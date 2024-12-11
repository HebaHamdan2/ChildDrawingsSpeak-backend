import drawingModel from "../../../DB/model/drawings.model.js";
import cloudinary from "../../services/cloudinary.js";

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

