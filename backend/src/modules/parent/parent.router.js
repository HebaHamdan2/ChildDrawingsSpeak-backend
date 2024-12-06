import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as valdators from "./parent.validation.js"
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as parentController from "./parent.controller.js"
import { auth} from "../../middleware/authentication.js";

const router=Router();
router.get('/',auth(),asyncHandler(parentController.profile));//diaply parent profile 
router.patch('/',auth(),fileUpload(fileValidation.image).single('image'),validation(valdators.profile),asyncHandler(parentController.updateProfile));//update parent profile info
router.patch("/updatePassword",auth(),validation(valdators.updatePassword),asyncHandler(parentController.updatePassword));//update password

export default router;