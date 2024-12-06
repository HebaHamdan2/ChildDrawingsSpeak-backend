import joi from "joi"
import{generalFields} from "../../middleware/validation.js";

export const profile= joi.object({
    file:generalFields.file,
    address:joi.string().alphanum(),
    username:joi.string().alphanum(),
})
export const updatePassword=joi.object({
        oldPassword:generalFields.password,
        newPassword:generalFields.password.invalid(joi.ref('oldPassword')),
    })

  