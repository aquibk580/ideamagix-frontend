"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import User from "../assets/Images/User.png";
import { toggleTheme } from "../redux/slices/themeSlice";
import {
  FaHome,
  FaUserMd,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import type { AppDispatch, RootState } from "../redux/store";
import axios from "axios";
import { setDoctor } from "../redux/slices/doctorSlice";
import { setpatient } from "../redux/slices/patientSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const doctorId = useSelector((state: RootState) => state.doctor.doctorId);
  const patient = useSelector((state: RootState) => state.patient.patient);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/checkAuth`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          if (response.data.authenticated === true) {
            if (response.data.role === "both") {
              dispatch(
                setDoctor({ doctor: true, doctorId: response.data.doctorId })
              );
              dispatch(
                setpatient({
                  patient: true,
                  patientId: response.data.patientId,
                })
              );
            } else if (response.data.role === "doctor") {
              dispatch(
                setDoctor({ doctor: true, doctorId: response.data.doctorId })
              );
            } else if (response.data.role === "patient") {
              dispatch(
                setpatient({
                  patient: true,
                  patientId: response.data.patientId,
                })
              );
            }
          } else {
            dispatch(setDoctor({ doctor: false, doctorId: "" }));
            dispatch(setpatient({ patient: false, patientId: "" }));
          }
        }
      } catch (error: any) {
        toast.error(error.message, {
          position: "top-center",
          theme: "dark",
        });
      }
    };
    checkAuth();
  }, [dispatch, navigate, doctor, patient]);

  const handleDoctorLogOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor/auth/logout`,
        null,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Logged Out Successfully", {
          position: "top-center",
          theme: "dark",
        });
        dispatch(setDoctor({ doctor: false, doctorId: "" }));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const handlePatientLogOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/patient/auth/logout`,
        null,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Logged Out Successfully", {
          position: "top-center",
          theme: "dark",
        });
        dispatch(setpatient({ patient: false, patientId: "" }));
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const handleDoctorSignin = () => {
    setIsAuthDropdownOpen(false);
    navigate("/doctor/auth/signin");
  };

  const handlePatientSignin = () => {
    setIsAuthDropdownOpen(false);
    navigate("/patient/auth/signin");
  };

  const handleDoctorSignup = () => {
    setIsAuthDropdownOpen(false);
    navigate("/doctor/auth/signup");
  };

  const handlePatientSignup = () => {
    setIsAuthDropdownOpen(false);
    navigate("/patient/auth/signup");
  };

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-gray-900";
  const textClass = theme === "light" ? "text-black" : "text-white";
  const shadow = theme === "light" ? "border-b-[2px] border-gray-300 " : "";
  const dropdownBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const dropdownHover =
    theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      // Close auth dropdown when clicking outside
      if (!(event.target as Element).closest(".dropdown-end")) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`navbar p-5 shadow-md ${bgClass} ${textClass} ${shadow} z-10 sticky top-0`}
      >
        <div className="flex-1">
          <Link className="btn btn-ghost text-xl font-bold" to="/">
            Health Care
          </Link>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <Link
            to="/"
            className={`btn btn-ghost btn-circle sm:flex hidden ${
              location.pathname === "/" ? "bg-primary text-white" : ""
            }`}
            title="Home"
          >
            <FaHome className="h-5 w-5" />
          </Link>

          <label className="swap swap-rotate transition duration-700">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => dispatch(toggleTheme())}
            />

            <svg
              className={`${
                theme === "light" ? "visible" : "hidden"
              } swap-off h-10 w-10 fill-current`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>

            <svg
              className={`${
                theme === "dark" ? "visible" : "hidden"
              } swap-on h-10 w-10 fill-current`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
          </label>

          {doctor || patient ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-10 rounded-full">
                  <img
                    src={User || "/placeholder.svg"}
                    alt="User"
                    className="shadow-sm cursor-pointer"
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg ${dropdownBg} ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1" role="none">
                    {doctor && (
                      <>
                        <div className="py-2 px-4 text-center border-b border-gray-200">
                          <p className="text-sm font-medium text-primary">
                            Doctor Account
                          </p>
                        </div>
                        <Link
                          to={`/doctor/${doctorId}`}
                          className={`block px-4 py-2 text-sm ${textClass} ${dropdownHover}`}
                          onClick={() => {
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FaUserMd className="h-4 w-4" />
                            Doctor Profile
                          </div>
                        </Link>
                        <Link
                          to={`/doctor/consultations/${doctorId}`}
                          className={`block px-4 py-2 text-sm ${textClass} ${dropdownHover}`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <FaCog className="h-4 w-4" />
                            Manage Consultaions
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 mt-1 pt-1">
                          <button
                            type="button"
                            className={`block w-full text-left px-4 py-2 text-sm text-red-500 ${dropdownHover}`}
                            onClick={handleDoctorLogOut}
                          >
                            <div className="flex items-center gap-2">
                              <FaSignOutAlt className="h-4 w-4" />
                              Logout
                            </div>
                          </button>
                        </div>
                      </>
                    )}

                    {patient && (
                      <>
                        <div className="py-2 px-4 text-center border-b border-gray-200">
                          <p className="text-sm font-medium text-primary">
                            Patient Account
                          </p>
                        </div>
                        <Link
                          to="/patient/dashboard"
                          className={`block px-4 py-2 text-sm ${textClass} ${dropdownHover}`}
                          onClick={() => setIsDropdownOpen(false)}
                        ></Link>
                        <Link
                          to="/patient/book-appointment"
                          className={`block px-4 py-2 text-sm ${textClass} ${dropdownHover}`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            <FaCog className="h-4 w-4" />
                            Book Appointment
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 mt-1 pt-1">
                          <button
                            type="button"
                            className={`block w-full text-left px-4 py-2 text-sm text-red-500 ${dropdownHover}`}
                            onClick={handlePatientLogOut}
                          >
                            <div className="flex items-center gap-2">
                              <FaSignOutAlt className="h-4 w-4" />
                              Logout
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Keep the existing non-authenticated dropdown code
            <div className="dropdown dropdown-end relative">
              <button
                onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                className="btn btn-primary flex items-center gap-2"
              >
                <FaSignInAlt className="h-4 w-4" />
                Sign In
              </button>

              {isAuthDropdownOpen && (
                <ul
                  className={`menu menu-sm absolute right-0 mt-2 z-[1] p-2 shadow rounded-box w-48 ${dropdownBg} border border-gray-200`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <li className="mb-1 font-medium text-center py-2 border-b border-gray-200">
                    <span>Choose Account Type</span>
                  </li>
                  <li>
                    <button
                      onClick={handleDoctorSignin}
                      className={`flex items-center gap-2 py-3 ${dropdownHover}`}
                    >
                      <FaUserMd className="h-4 w-4 text-blue-500" />
                      Doctor Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleDoctorSignup}
                      className={`flex items-center gap-2 py-3 ${dropdownHover}`}
                    >
                      <FaUserMd className="h-4 w-4 text-blue-500" />
                      Doctor SignUp
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handlePatientSignin}
                      className={`flex items-center gap-2 py-3 ${dropdownHover}`}
                    >
                      <FaUser className="h-4 w-4 text-green-500" />
                      Patient Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handlePatientSignup}
                      className={`flex items-center gap-2 py-3 ${dropdownHover}`}
                    >
                      <FaUser className="h-4 w-4 text-green-500" />
                      Patient SignUp
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
