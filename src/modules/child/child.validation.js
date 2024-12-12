import joi from "joi"
import{generalFields} from "../../middleware/validation.js";

export const profile= joi.object({
    name:joi.string().min(4).max(20).required(),
    file:generalFields.file,
    dateOfBirth:joi.date().required(),
    gender: joi.string().valid("Male","Female").required(),
    parentId:joi.string(),
})
