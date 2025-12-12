// src/validation/regFormValidationSchema.js
import * as yup from "yup";

const regFormValidationSchema = yup.object().shape({
  name: yup.string().required("Name can't be empty!"),
  email: yup.string().required("Email can't be empty!").email("Enter a valid email!"),
  password: yup.string().required("Password can't be empty!").min(6, "Minimum 6 characters!"),
});

export default regFormValidationSchema;
