export const validate = (type) => {
  let list = {
    email: {
      required: "Email is required",
      pattern: {
        value:
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.\d{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-\Z\-0-9]+\.)+[a-z]{2,}))$/,
        message: "wrong email pattern",
      },
      maxLength: {
        value: 50,
        message: "max Email characters is 50 letters",
      },
    },
    name: {
      required: "Name is required",
      pattern: {
        value: /^[A-Za-z ]+$/i,
        message: "Enter characters only",
      },
      maxLength: {
        value: 40,
        message: "max name length is 40 characters",
      },
      minLength: {
        value: 3,
        message: "min name length is 3 characters",
      },
    },
    password: {
      required: "Password is required",
      maxLength: {
        value: 15,
        message: "max password length is 15 characters",
      },
      minLength: {
        value: 6,
        message: "min password length is 6 characters",
      },
    },
  };
  return list[type];
};
