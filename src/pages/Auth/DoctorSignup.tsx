import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import axios from "axios";
import { setDoctor } from "../../redux/slices/doctorSlice";

// Define the Zod schema based on the Doctor model
const doctorFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    specialty: z.string().min(1, { message: "Please select a specialty" }),
    experience: z.coerce
      .number()
      .min(0, { message: "Experience must be a positive number" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
];

export default function DoctorSignup() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      specialty: "",
      experience: 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, String(value));
        }
      });

      if (profileImage) {
        formData.append("pfp", profileImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor/auth/signup`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Your account has been created successfully.");
        dispatch(
          setDoctor({ doctor: true, doctorId: response.data.doctor.id })
        );
        navigate("/");
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
          theme: "dark",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account", {
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
        className={`card w-full max-w-md bg-base-100 shadow-xl ${bgFormClass} `}
      >
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Doctor Sign Up</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Dr. John Doe"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="doctor@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className={`input input-bordered w-full ${
                  errors.phone ? "input-error" : ""
                }`}
                {...register("phone")}
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.phone.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Specialty</span>
              </label>
              <select
                className={`select select-bordered w-full ${
                  errors.specialty ? "select-error" : ""
                }`}
                {...register("specialty")}
              >
                <option value="">Select your specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.specialty.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Years of Experience</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="5.5"
                className={`input input-bordered w-full ${
                  errors.experience ? "input-error" : ""
                }`}
                {...register("experience")}
              />
              {errors.experience && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.experience.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Profile Image</span>
              </label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview && (
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile preview"
                      />
                    </div>
                  </div>
                )}
                <label
                  htmlFor="profileImage"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-base-300 hover:bg-base-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-base-content opacity-70" />
                    <p className="mb-2 text-sm text-base-content">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-base-content opacity-70">
                      PNG, JPG or JPEG (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    id="profileImage"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-primary hover:underline">
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
