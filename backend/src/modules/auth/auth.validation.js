import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const signupSchema=  joi.object( {
        username:joi.string().min(4).max(20).required(),
        email:generalFields.email,
        password:generalFields.password,
        cPassword:joi.valid(joi.ref('password')).required(),
        address:joi.string().alphanum().required(),
        file:generalFields.file.required(),
        })


export const signinSchema=joi.object({
email:generalFields.email,
password:generalFields.password

})