import joi from "joi"
import{generalFields} from "../../middleware/validation.js";

export const account= joi.object({
    file:generalFields.file,
    address:joi.string().alphanum(),
    username:joi.string().min(4).max(20).required(),
})
export const updatePassword=joi.object({
        oldPassword:generalFields.password,
        newPassword:generalFields.password.invalid(joi.ref('oldPassword')),
    })

  