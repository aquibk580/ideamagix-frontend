import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Phone, Mail, Award, Briefcase } from "lucide-react";
import type { RootState } from "../../redux/store";

// Define the Doctor type based on the schema
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  specialty: string;
  experience: number;
}

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/profile`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setDoctor(response.data);
        } else {
          throw new Error("Failed to fetch doctor profile");
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching doctor profile"
        );
        toast.error("Failed to load doctor profile", {
          position: "top-center",
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-[#26313f]";
  const textClass = theme === "light" ? "text-black" : "text-white";
  const cardClass = theme === "light" ? "bg-white" : "bg-[#23272a]";

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass}`}
      >
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass}`}
      >
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error || "Failed to load doctor profile"}</span>
          </div>
          <button
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-5 py-12 ${bgClass} ${textClass}`}
    >
      <div className={`card w-full shadow-xl ${cardClass}`}>
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-8 md:justify-between">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="avatar">
                <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      doctor.profileImage ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={doctor.name}
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <div className="badge badge-primary mt-2">
                  {doctor.specialty}
                </div>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-6">
              <div className="divider md:hidden">Details</div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Contact Information</h3>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{doctor.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{doctor.email}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Professional Information
                </h3>

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>Specializes in {doctor.specialty}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <span>{doctor.experience} years of experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
