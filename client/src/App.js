import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login.js";
import React from "react";
import NotFoundPage from "./pages/NotFoundPage.js";
import MainRoutes from "./pages/MainRoutes.js";

const App = () => {
  let {pathname}= useLocation()
  console.log(pathname);
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/*" element={<MainRoutes />} />
      <Route path="/notFound" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/notFound" state={pathname} replace />} />
    </Routes>
  );
};

export default App;
