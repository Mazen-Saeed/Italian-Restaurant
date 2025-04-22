import React from "react";

// formik
import { Formik, Form } from "formik";
import { TextInput } from "./FormLib";
import * as Yup from "yup";

//icons
import { FiMail, FiLock } from "react-icons/fi";

//Loader
import { ThreeDots } from "react-loader-spinner";

import "./LoginForm.css";

function LoginForm({ show, onClose, onSwitchForm }) {
  if (!show) return null;
  return (
    <div className="app__loginform ">
      <div className="app__loginform-container">
        <h2 className="app__loginform-headtext">Login</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password is too short")
              .max(30, "Password is too long")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                name="email"
                label="Email or Username"
                type="email"
                placeholder="italiano@example.com"
                icon={<FiMail />}
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                placeholder="*********"
                icon={<FiLock />}
              />
              {!isSubmitting && (
                <button
                  type="submit"
                  className="custom__button"
                  style={{ marginTop: "20px" }}
                >
                  Login
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
                    height="80"
                    width="40"
                    color="var(--color-white)"
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
        <div className="app__loginform-container_signnow">
          <p className="p__opensans">Not a member?</p>
          <button
            className="p__opensans auth-toggle-btn"
            onClick={onSwitchForm}
          >
            Signup now
          </button>
        </div>
        <p className="app__loginform-container_copyright">
          All rights reserved &copy; 2020
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
