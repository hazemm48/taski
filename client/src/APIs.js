import moment from "moment";

const baseApi = process.env.REACT_APP_API;

let tokenCheck = () => {
  if (localStorage.token) {
    let token = JSON.parse(localStorage.token);
    if (token.expiry) {
      let date = moment().format("YYYY-MM-DD HH:mm");
      if (moment(date).diff(moment(token.expiry)) >= 0) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  }
};
tokenCheck();

let headers = () => {
  tokenCheck();
  let key = "Bearer";
  let token = JSON.parse(localStorage.getItem("token"));
  return {
    Accept: "application/json",
    Authorization: `${key} ${token.key}`,
    "Content-Type": "application/json",
  };
};

export const login = async (body) => {
  let data = await fetch(`${baseApi}/user/signIn`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const signUpApi = async (body) => {
  let data = await fetch(`${baseApi}/user/signUp`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const changePass = async (body) => {
  let data = await fetch(`${baseApi}/user/changePass`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers(),
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const getUser = async () => {
  let data = await fetch(`${baseApi}/user/getUser`, {
    method: "GET",
    headers: headers(),
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const deleteUser = async () => {
  let data = await fetch(`${baseApi}/user/deleteUser`, {
    method: "DELETE",
    headers: headers(),
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

export const taskApi = async (method, url, body) => {
  console.log(method,url,body);
  let data = await fetch(`${baseApi}/task/${url ? url : ""}`, {
    method,
    body,
    headers: headers(),
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
};

 
