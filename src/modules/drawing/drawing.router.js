import { Router } from "express";
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as drawingController from "./drawing.controller.js"
import { auth} from "../../middleware/authentication.js";

const router=Router();
router.post('/:childId',auth(),fileUpload(fileValidation.image).single('image'),asyncHandler(drawingController.addDrawingPredict));//add drawing prediction
router.get('/:childId',auth(),asyncHandler(drawingController.getAllDrawings));//disaply child drawings results + pageination +sort
router.get('/:childId/:drawingId',auth(),asyncHandler(drawingController.getSpecificDrawing));//diaply specific drawing info 
router.delete("/delete/:childId/:drawingId",auth(),asyncHandler(drawingController.deleteSpecificDrawing));//delete specific drawing a child
router.delete("/delete/:childId",auth(),asyncHandler(drawingController.deleteAllDrawings));//delete all drawings for a child

export default router;