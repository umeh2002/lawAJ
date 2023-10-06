import joi from "joi";

let regex =
  /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;

export const createUserValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  name: joi.string().required(),
  password: joi.string().pattern(new RegExp(regex)).required(),
  confirm: joi.ref("password"),
});

export const createLawyerValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  name: joi.string().required(),
  password: joi.string().pattern(new RegExp(regex)).required(),
  confirm: joi.ref("password"),
  lawSecret: joi.string().required(),
});

export const signInValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
  password: joi.string().pattern(new RegExp(regex)).required(),
});

export const resetPasswordValidator = joi.object({
  email: joi.string().email().lowercase().trim().required(),
});

export const changePasswordValidator = joi.object({
    password: joi.string().pattern(new RegExp(regex)).required(),
  });