import joi from "joi";

export const ValidateSignup = (userData) => {
  const Schema = joi.object({
    fullname: joi.string().required().min(4),
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
    address: joi.array().items(joi.object({ detail: joi.string(), for: joi.string() })),
    phoneNumber: joi.number(),
    age: joi.number().required(),
    city: joi.string().required(),
    zipCode: joi.string().regex(/^\d{5}(-\d{4})?$/).required(),
    id: joi.string().regex(/^\d+$/).required()
  });

  return Schema.validateAsync(userData);
};

export const ValidateSignin = (userData) => {

const Schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(5).required()
});

return Schema.validateAsync(userData);

};