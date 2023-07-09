const validation = (schema) => {
  return (req, res, next) => {
    let valid = schema.body.validate(req.body, { abortEarly: false });
    if (valid.error) {
      res.status(400).json({ message: "error", errors: valid.error });
    } else {
      next();
    }
  };
};

export default validation;
