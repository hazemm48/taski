import joi from "joi";

const signUpSchema = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(3).max(30).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi.string().min(6).max(15).required(),
    }),
};

const signInSchema = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi.string().min(6).max(15).required(),
      rememberMe: joi.boolean(),
    }),
};

export { signUpSchema, signInSchema };
