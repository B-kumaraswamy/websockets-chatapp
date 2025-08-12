import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPassword = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { isLoading, forgotpassword } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();

  if (!location.state?.fromLogin) {
    return <Navigate to="/login" />;
  }

  const onSubmit = async (data) => {
    // Simulate API call
    console.log("Sending reset link to:", data.email);
    setSubmittedEmail(data.email);
    setEmailSent(true);
    await forgotpassword(data.email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="bg-base-100 shadow-xl rounded-box w-full max-w-md p-8 text-center space-y-6">
        {!emailSent ? (
          <>
            <h2 className="text-2xl font-bold text-primary">Forgot Password</h2>
            <p className="text-sm text-base-content">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <Mail className="size-4 text-base-content/70" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email"
                  className="grow"
                />
              </label>
              {errors.email && (
                <p className="text-error text-sm font-medium">
                  {errors.email.message}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <Link to="/login" className="text-sm text-primary hover:underline">
              &larr; Back to Login
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary">Forgot Password</h2>
            <div className="flex justify-center">
              <div className="bg-success rounded-full p-4 mb-2">
                <Mail className="text-white size-6" />
              </div>
            </div>
            <p className="text-sm text-base-content">
              If an account exists for <strong>{submittedEmail}</strong>, you
              will receive a password reset link shortly.
            </p>
            <Link
              to="/login"
              className="text-sm text-primary hover:underline mt-4 inline-block"
            >
              &larr; Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
