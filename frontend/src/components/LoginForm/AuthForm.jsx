import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignForm";

const AuthForm = ({ show, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!show) return null;

  return isLogin ? (
    <LoginForm
      show={true}
      onClose={onClose}
      onSwitchForm={() => setIsLogin(false)}
    />
  ) : (
    <SignupForm
      show={true}
      onClose={onClose}
      onSwitchForm={() => setIsLogin(true)}
    />
  );
};

export default AuthForm;
