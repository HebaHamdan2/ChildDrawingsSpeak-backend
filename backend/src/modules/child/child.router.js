import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as valdators from "./child.validation.js"
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as childController from "./child.controller.js"
import { auth} from "../../middleware/authentication.js";

const router=Router();
router.post('/',auth(),fileUpload(fileValidation.image).single('image'),validation(valdators.profile),asyncHandler(childController.createProfile));//create child profile
router.get('/',auth(),asyncHandler(childController.getProfiles));//disaply children profiles with pagenation with sort and search options
router.get('/:childId',auth(),asyncHandler(childController.getSpecificProfile));//diaply specific child info 
router.patch('/:childId',auth(),fileUpload(fileValidation.image).single('image'),asyncHandler(childController.updateProfile));//update specific child info
router.delete("/delete/:childId",auth(),asyncHandler(childController.deleteChild));//delete specific child profile
router.delete("/delete",auth(),asyncHandler(childController.deleteAllChildren));//delete all children profiles
export default router;