import { useField } from "formik";
import { useState } from "react";

// Eye for password
import { FiEyeOff, FiEye } from "react-icons/fi";

import "./LoginForm.css";

export const TextInput = ({ icon, ...props }) => {
  const [field, meta] = useField(props);
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <label className="p__opensans app__loginform-container_label">
        {props.label}
      </label>
      {props.type !== "password" && (
        <input
          {...field}
          invalid={meta.touched && meta.error}
          type={props.type}
          className="app__loginform-container_input"
          placeholder={props.placeholder}
        />
      )}
      {props.type === "password" && (
        <input
          {...field}
          invalid={meta.touched && meta.error}
          type={show ? "text" : "password"}
          className="app__loginform-container_input"
          placeholder={props.placeholder}
        />
      )}

      <div className="app__loginform-container_inputIcon">{icon}</div>

      {props.type === "password" && (
        <div
          className="app__loginform-container_inputIconEye"
          onClick={() => setShow(!show)}
        >
          {show ? <FiEye /> : <FiEyeOff />}
        </div>
      )}

      {meta.touched && meta.error ? (
        <div className="app__loginform-container_errorMsg">{meta.error}</div>
      ) : (
        <div
          className="app__loginform-container_errorMsg"
          style={{ visibility: "hidden" }}
        >
          .
        </div>
      )}
    </div>
  );
};
