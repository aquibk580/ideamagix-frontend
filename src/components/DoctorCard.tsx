import { useSelector } from "react-redux";
import { type Doctor } from "../types/entityTypes";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const navigate = useNavigate();
  const patient = useSelector((state: RootState) => state.patient.patient);
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={doctor.profileImage}
            alt={`${doctor.name} logo`}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-sm text-base-content text-opacity-70">
              Specialty : {doctor.specialty}
            </p>
            <p className="text-sm text-base-content text-opacity-70">
              Experience : {doctor.experience} Years
            </p>
          </div>
        </div>
        {patient ? (
          <button
            onClick={() => navigate(`patient/consult/${doctor.id}`)}
            className="btn btn-primary w-full"
          >
            Consult Now
          </button>
        ) : (
          <button
            onClick={() => navigate("/patient/auth/signin")}
            className="btn btn-primary w-full"
          >
            Login to consult
          </button>
        )}
      </div>
    </div>
  );
}
