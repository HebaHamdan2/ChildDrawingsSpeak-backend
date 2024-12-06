import { Router } from"express";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
import * as AuthController from './auth.controller.js';
import { validation } from "../../middleware/validation.js";
import * as valdators from "./auth.validation.js"
const router=Router();

router.post("/signup",fileUpload(fileValidation.image).single("image"),validation(valdators.signupSchema),asyncHandler(AuthController.signUp));
router.get("/confirmEmail/:token",asyncHandler(AuthController.confirmEmail));
router.post("/signin",validation(valdators.signinSchema),asyncHandler(AuthController.signIn));
router.patch("/sendcode", AuthController.sendCode);
router.patch("/forgetPasseword",asyncHandler(AuthController.forgetPasseword));
router.delete("/invalidConfirm",asyncHandler(AuthController.deleteInvalidConfirm));
export default router;