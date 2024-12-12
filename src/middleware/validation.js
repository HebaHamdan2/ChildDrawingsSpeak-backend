import joi from "joi";

export const generalFields = {
  email: joi.string().email().required().min(5).messages({
    "string.email": "Please Enter a Valid Emai!",
    "string.empty": "email is required",
  }),
  password: joi.string().required().min(3).messages({
    "string.empty": "password is required",
  }),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.params, ...req.query };
    if (req.file || req.files) {
      inputData.file = req.file || req.files;
    }
    const validationResult = schema.validate(inputData, { abortEarly: false });//will not stop in first error ,so it will return all errors
    if (validationResult.error?.details) {
      return res
        .status(400)
        .json({
          message: "validation error",
          validationError: validationResult.error?.details,
        });
    }
    next();
  };
};
