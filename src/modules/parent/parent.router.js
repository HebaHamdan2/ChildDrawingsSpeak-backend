import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as valdators from "./parent.validation.js"
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as parentController from "./parent.controller.js"
import { auth} from "../../middleware/authentication.js";

const router=Router();
router.get('/',auth(),asyncHandler(parentController.getAccountInfo));//diaply parent account info 
router.patch('/',auth(),fileUpload(fileValidation.image).single('image'),validation(valdators.account),asyncHandler(parentController.updateAccount));//update parent account info
router.patch("/updatePassword",auth(),validation(valdators.updatePassword),asyncHandler(parentController.updatePassword));//update password
router.delete("/delete",auth(),asyncHandler(parentController.deleteAccount));//delete parent account
export default router;