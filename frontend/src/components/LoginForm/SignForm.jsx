import React from "react";

// formik
import { Formik, Form } from "formik";
import { TextInput } from "./FormLib";
import * as Yup from "yup";

//icons
import {
  FiMail,
  FiLock,
  FiUser,
  FiUserCheck,
  FiCalendar,
  FiPhone,
  FiHome,
} from "react-icons/fi";

//Loader
import { ThreeDots } from "react-loader-spinner";

// auth & redux
import { connect } from "react-redux";
import { signupUser } from "../../auth/actions/userActions";
// import { useHistory } from "react-router-dom";

import "./SignForm.css";

function SignupForm({ show, onClose, onSwitchForm, signupUser }) {
  // const history = useHistory();

  if (!show) return null;
  return (
    <div className="app__SignForm ">
      <div className="app__SignForm-container">
        <h2 className="app__SignForm-headtext">Signup</h2>
        <Formik
          initialValues={{
            name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
            dateOfBirth: "",
            address: "",
            phone: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            username: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password is too short")
              .max(30, "Password is too long")
              .required("Required"),
            passwordConfirm: Yup.string()
              .required("Required")
              .oneOf([Yup.ref("password")], "Password must match"),
            dateOfBirth: Yup.date().required("Required"),
            phone: Yup.string()
              .required("Required")
              .matches(/^[0-9]{11}$/, "Phone number must be 11 digits"),
            address: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            console.log(values);
            // signupUser(values, history, setSubmitting, setFieldError);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="name"
                label="Full Name"
                type="text"
                icon={<FiUser />}
              />
              <TextInput
                name="username"
                label="Username"
                type="text"
                icon={<FiUserCheck />}
              />
              <TextInput
                name="email"
                label="Email"
                type="email"
                icon={<FiMail />}
              />
              <TextInput
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                icon={<FiCalendar />}
              />
              <TextInput
                name="password"
                label="Password"
                type="password"
                icon={<FiLock />}
              />
              <TextInput
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                icon={<FiLock />}
              />
              <TextInput
                name="phone"
                label="Phone"
                type="tel"
                icon={<FiPhone />}
              />
              <TextInput
                name="address"
                label="Address"
                type="text"
                icon={<FiHome />}
              />
              {!isSubmitting && (
                <button
                  type="submit"
                  className="custom__button"
                  style={{ marginTop: "20px" }}
                >
                  Signup
                </button>
              )}
              {isSubmitting && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    width: "100%",
                  }}
                >
                  <ThreeDots
                    height="40"
                    width="40"
                    color="var(--color-white)"
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
        <div className="app__SignForm-container_signnow">
          <p className="p__opensans">Already have an account?</p>
          <button
            className="p__opensans auth-toggle-btn"
            onClick={onSwitchForm}
          >
            Login
          </button>
        </div>
        <p className="app__SignForm-container_copyright">
          All rights reserved &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default connect(null, { signupUser })(SignupForm);
