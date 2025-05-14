import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FileText,
  Calendar,
  User,
  AlertCircle,
  DollarSign,
  Pill,
} from "lucide-react";
import type { RootState } from "../../redux/store";

// Define the types based on the schema
type DiabetesStatus = "Diabetics" | "NonDiabetics";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  age: number;
}

interface Prescription {
  id: string;
  medicines: string;
  dosage: string;
  duration: string;
}

interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  step1Illness: string;
  step1Surgery: string;
  diabetesStatus: DiabetesStatus;
  allergies: string;
  others: string;
  paymentTxnId: string;
  Patient: Patient;
  prescription?: Prescription;
  prescriptionId?: string;
  createdAt?: string; // Assuming the API returns a timestamp
}

export default function DoctorConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/consultations`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setConsultations(response.data.consultations);
        } else {
          throw new Error("Failed to fetch consultations");
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching consultations"
        );
        toast.error("Failed to load consultations", {
          position: "top-center",
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-[#26313f]";
  const textClass = theme === "light" ? "text-black" : "text-white";
  const cardClass = theme === "light" ? "bg-white" : "bg-[#23272a]";

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass}`}
      >
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading consultations...</p>
        </div>
      </div>
    );
  }

  if (error || !consultations) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass}`}
      >
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <AlertCircle className="w-6 h-6" />
            <span>{error || "Failed to load consultations"}</span>
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

  if (consultations.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${bgClass} ${textClass}`}
      >
        <div className="text-center max-w-md">
          <div className="alert alert-info">
            <FileText className="w-6 h-6" />
            <span>
              No consultations found. Your consultation history will appear
              here.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-6`}>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Consultations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className={`card shadow-xl ${cardClass} hover:shadow-2xl transition-shadow`}
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {consultation.Patient.name}
                  </h2>
                  <div className="badge badge-primary">
                    {consultation.diabetesStatus === "Diabetics"
                      ? "Diabetic"
                      : "Non-Diabetic"}
                  </div>
                </div>

                <div className="flex items-center text-sm opacity-70 mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {consultation.createdAt
                    ? formatDate(consultation.createdAt)
                    : "Date not available"}
                </div>

                <div className="divider my-2"></div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Illness</h3>
                    <p className="text-sm mt-1">
                      {truncateText(consultation.step1Illness, 100)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Surgery History</h3>
                    <p className="text-sm mt-1">
                      {truncateText(consultation.step1Surgery, 100)}
                    </p>
                  </div>

                  {consultation.allergies && (
                    <div>
                      <h3 className="font-semibold">Allergies</h3>
                      <p className="text-sm mt-1">
                        {truncateText(consultation.allergies, 80)}
                      </p>
                    </div>
                  )}

                  {consultation.others && (
                    <div>
                      <h3 className="font-semibold">Additional Information</h3>
                      <p className="text-sm mt-1">
                        {truncateText(consultation.others, 80)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm">Paid</span>
                  </div>

                  <div className="flex items-center">
                    <Pill className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {consultation.prescription
                        ? "Prescription Added"
                        : "No Prescription"}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">
                    View Details
                  </button>
                  {!consultation.prescription && (
                    <button className="btn btn-outline btn-sm">
                      Add Prescription
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
