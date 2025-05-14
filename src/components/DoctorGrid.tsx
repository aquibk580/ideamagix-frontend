import { useEffect, useState } from "react";
import { DoctorCard } from "./DoctorCard";
import { toast } from "react-toastify";
import axios from "axios";
import { type Doctor } from "../types/entityTypes";

export function DoctorGrid() {
  const [doctors, setDoctors] = useState<Array<Doctor> | []>([]);

  useEffect(() => {
    const getAllDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/patient/doctors`
        );
        console.log(response.data);
        if (response.status === 200) {
          setDoctors(response.data);
        } else {
          setDoctors([]);
        }
      } catch (error: any) {
        setDoctors([]);
        toast.error(error.messgae, {
          position: "top-center",
          theme: "dark",
        });
      }
    };
    getAllDoctors();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.length > 0 ? (
          doctors?.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <h2>Doctors not available</h2>
        )}
      </div>
    </>
  );
}
