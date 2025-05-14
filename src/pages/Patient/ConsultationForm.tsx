// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import axios from "axios";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

// Define the Zod schema based on the Consultation model
const consultationFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient ID is required" }),
  doctorId: z.string().min(1, { message: "Doctor ID is required" }),
  step1Illness: z
    .string()
    .min(1, { message: "Illness information is required" }),
  step1Surgery: z
    .string()
    .min(1, { message: "Surgery information is required" }),
  diabetesStatus: z.enum(["Diabetics", "NonDiabetics"], {
    errorMap: () => ({ message: "Please select a diabetes status" }),
  }),
  allergies: z.string().optional().default(""),
  others: z.string().optional().default(""),
  paymentTxnId: z.string().optional(),
});

// Define the type from the Zod schema
type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export default function DoctorsConsultationForm() {
  const params = useParams();
  const doctorId = params.doctorId || "";
  const patientId = useSelector((state: RootState) => state.patient.patientId);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentTxnId, setPaymentTxnId] = useState("");
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      patientId: patientId || "",
      doctorId: doctorId || "",
      step1Illness: "",
      step1Surgery: "",
      diabetesStatus: "NonDiabetics" as const,
      allergies: "",
      others: "",
    },
    mode: "onChange",
  });

  // Watch form values for validation
  const watchedFields = watch();

  // Set patient and doctor IDs from props/redux
  useEffect(() => {
    if (patientId) {
      setValue("patientId", patientId);
    }
    if (doctorId) {
      setValue("doctorId", doctorId);
    }
  }, [patientId, doctorId, setValue]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof ConsultationFormValues)[] = [];

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ["step1Illness", "step1Surgery"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["diabetesStatus"];
    }

    // Validate the fields for the current step
    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const simulatePayment = () => {
    // Generate a random transaction ID
    const randomTxnId = "TXN_" + Math.random().toString(36).substring(2, 15);
    setPaymentTxnId(randomTxnId);
    setValue("paymentTxnId", randomTxnId);
    setPaymentComplete(true);
    toast.success("Payment successful!", {
      position: "top-center",
      theme: "dark",
    });
  };

  const onSubmit = async (data: ConsultationFormValues) => {
    if (!paymentComplete) {
      toast.error("Please complete the payment first", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/patient/consult/${doctorId}`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Consultation created successfully.");
        navigate("/");
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create consultation", {
        position: "top-center",
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-[#26313f]";
  const textClass = theme === "light" ? "text-black" : "text-white";
  const bgFormClass = theme === "light" ? "bg-[#F8F9FA]" : "bg-[#23272a]";

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-5 py-12 ${bgClass} ${textClass}`}
    >
      <div
        className={`card w-full max-w-2xl bg-base-100 shadow-xl ${bgFormClass}`}
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">
            Doctor's Consultation Form
          </h2>
          {/* Progress Steps */}
          <div className="w-full py-4">
            <ul className="steps steps-horizontal w-full">
              <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
                Medical History
              </li>
              <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
                Family History
              </li>
              <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
                Payment
              </li>
            </ul>
          </div>
          // @ts-ignore
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Current illness and surgery history */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Current Illness History</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-32 ${
                      errors.step1Illness ? "textarea-error" : ""
                    }`}
                    placeholder="Please describe your current illness or symptoms in detail"
                    {...register("step1Illness")}
                  ></textarea>
                  {errors.step1Illness && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.step1Illness.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Recent Surgery History</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-32 ${
                      errors.step1Surgery ? "textarea-error" : ""
                    }`}
                    placeholder="Please list any recent surgeries with dates (e.g., Appendectomy - March 2023)"
                    {...register("step1Surgery")}
                  ></textarea>
                  {errors.step1Surgery && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.step1Surgery.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Family medical history */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Diabetes Status
                    </span>
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="radio radio-primary"
                        value="Diabetics"
                        {...register("diabetesStatus")}
                      />
                      <span>Diabetics</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="radio radio-primary"
                        value="NonDiabetics"
                        {...register("diabetesStatus")}
                      />
                      <span>Non-Diabetics</span>
                    </label>
                  </div>
                  {errors.diabetesStatus && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.diabetesStatus.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Allergies</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Please list any allergies (medications, food, etc.)"
                    {...register("allergies")}
                  ></textarea>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">
                      Other Medical Information
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Any other relevant family medical history or information"
                    {...register("others")}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-center">Payment</h3>
                <p className="text-center">
                  Please scan the QR code below to complete your payment for the
                  consultation.
                </p>

                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeCanvas
                      value={`consultation-payment:${watchedFields.patientId}-${
                        watchedFields.doctorId
                      }-${Date.now()}`}
                      size={200}
                      level="H"
                    />
                  </div>

                  <div className="text-center">
                    <p className="font-medium">Amount: $50.00</p>
                    <p className="text-sm opacity-70">Consultation Fee</p>
                  </div>

                  {paymentComplete ? (
                    <div className="alert alert-success">
                      <Check className="w-5 h-5" />
                      <span>Payment successful!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={simulatePayment}
                    >
                      Simulate Payment
                    </button>
                  )}

                  <div className="form-control w-full max-w-md">
                    <label className="label">
                      <span className="label-text">Transaction ID</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={paymentTxnId}
                      readOnly
                      placeholder="Transaction ID will appear here after payment"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={prevStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !paymentComplete}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Consultation
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
