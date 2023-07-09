import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../components/Loading.js";
import { login, signUpApi } from "../APIs.js";
import { useForm } from "react-hook-form";
import { validate } from "../validation/FormValidate.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (localStorage.token) {
      navigate("/home");
    }
  }, []);

  const signIn = async () => {
    let formEl = document.forms.signInForm;
    let formData = new FormData(formEl);
    let rememberMe = formData.get("rememberMe");
    rememberMe == "on" ? (rememberMe = true) : (rememberMe = false);
    let body = {
      email: formData.get("emaill").toLowerCase(),
      password: formData.get("passwordd"),
      rememberMe,
    };
    let data = await login(body);
    if (data.message == "welcome") {
      localStorage.setItem(
        "token",
        JSON.stringify({
          key: data.token,
          expiry: data.expiry,
        })
      );
      navigate("/home");
    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  const signUp = async (data) => {
    setLoading(true)
    let body = {
      ...data,
    };
    let { message } = await signUpApi(body);
    if (message == "user added") {
      alert(
        "A confirmation message have been sent to your email, please confirm your email first"
      );
      window.location.reload();
    } else if (message == "already registered") {
      alert(message);
      setLoading(false);
    } else {
      alert("Something went wrong, Please try again later");
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".login");

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }, []);

  return (
    <div className="login">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="forms-container">
            <div className="signin-signup">
              <form id="signInForm" className="sign-in-form">
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <i className="las la-envelope" />
                  <input
                    name="emaill"
                    type="text"
                    placeholder="E-mail"
                    required
                  />
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="passwordd"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="form-check" style={{ color: "white" }}>
                  <input name="rememberMe" type="checkbox" required />
                  remember me
                </div>
                <input
                  type="button"
                  onClick={() => {
                    signIn();
                  }}
                  defaultValue="Login"
                  className="btn solid"
                />
                <a href="" className="social-text">
                  forget password ?
                </a>
              </form>
              <form
                id="signUpForm"
                className="sign-up-form"
                onSubmit={handleSubmit(signUp)}
              >
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                  <i className="las la-user-circle" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Full Name"
                    {...register("name", validate("name"))}
                  />
                  {errors.name && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.name.message}
                      </small>
                    </>
                  )}
                </div>
                <div className="input-field">
                  <i className="las la-envelope" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...register("email", validate("email"))}
                  />
                  {errors.email && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.email.message}
                      </small>
                    </>
                  )}
                </div>
                <div className="input-field">
                  <i className="las la-key" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    {...register("password", validate("password"))}
                  />
                  {errors.password && (
                    <>
                      <i className="login-warning las la-exclamation-triangle " />
                      <small className="text-warning">
                        {errors.password.message}
                      </small>
                    </>
                  )}
                </div>
                <input type="submit" className="btn" defaultValue="Sign up" />
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <p>New here ?</p>
                <button className="btn transparent" id="sign-up-btn">
                  Sign up
                </button>
              </div>
              <img src className="image imagesign-up" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>Already a user ?</h3>
                <p></p>
                <button className="btn transparent" id="sign-in-btn">
                  Sign in
                </button>
              </div>
              <img src className="image imagesign-in" alt="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
