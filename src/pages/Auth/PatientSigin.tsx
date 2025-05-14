import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "../../redux/store";
import { setpatient } from "../../redux/slices/patientSlice";

const PatientSignin = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const patient = useSelector((state: RootState) => state.patient.patient);

  useEffect(() => {
    if (patient) {
      navigate("/");
    }
  }, [patient, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/patient/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Logged in Successfully", {
          position: "top-center",
          theme: "dark",
        });
        dispatch(
          setpatient({ patient: true, patientId: response.data.patient.id })
        );
        navigate("/");
      }
    } catch (error: any) {
      if (error.response.data.flag === "PatientNotFound") {
        toast.error("Email not found", {
          position: "top-center",
          theme: "dark",
        });
      } else if (error.response.data.flag === "InvalidCredentials") {
        toast.error("Invalid Credentials", {
          position: "top-center",
          theme: "dark",
        });
      }
      toast.error(error, {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-[#26313f]";
  const textClass = theme === "light" ? "text-black" : "text-white";

  const bgFormClass = theme === "light" ? "bg-[#F8F9FA]" : "bg-[#23272a]";

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass} px-5`}
    >
      <div
        className={`w-full max-w-md p-8 space-y-6 ${bgFormClass} ${textClass} shadow-lg rounded-lg`}
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full  border-gray-600"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full border-gray-600"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn bg-[#5865f2] hover:bg-[#4752c4] text-white w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-[#5865f2] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientSignin;
