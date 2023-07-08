import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import SideNav from "../components/SideNav.js";
import Settings from "./Settings.js";
import Calendar from "./Calendar.js";
import LoadingSpinner from "../components/Loading.js";
import HomePage from "./HomePage.js";
import { getUser } from "../APIs.js";
import TaskDetails from "./tasks/TaskDetails.js";
import AddTask from "./tasks/AddTask.js";

const MainRoutes = () => {
  const [userDet, setUserDet] = useState();
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const GetDetails = async () => {
    let { user } = await getUser();
    setUserDet(user);
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      GetDetails();
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        userDet && (
          <>
            <Header user={userDet} />
            <main>
              <SideNav id={userDet._id} />
              <Routes>
                <Route
                  exact
                  path="/home"
                  element={<HomePage user={userDet} />}
                />
                <Route
                  exact
                  path="/tasks"
                  element={
                    <Calendar
                      filter={{ patientId: userDet._id }}
                      role={userDet.role}
                    />
                  }
                />
                <Route exact path="/addTask" element={<AddTask />} />
                <Route exact path="/taskDetails" element={<TaskDetails userId={userDet._id}/>} />
                <Route
                  exact
                  path="/settings"
                  element={<Settings user={userDet} role={userDet.role} />}
                />
                <Route path="*" element={<Navigate to="/notFound" replace />} />
              </Routes>
            </main>
          </>
        )
      )}
    </>
  );
};

export default MainRoutes;
