import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthStore(); 
  const navigate = useNavigate();
  const { token } = useParams(); 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!token) return;
    setLoading(true);
    try {
      await resetPassword(token, data.password);
      navigate("/login");
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm p-6 space-y-6 rounded-xl bg-base-200 shadow-md">
        <h2 className="text-center text-2xl font-semibold text-primary">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <Lock className="size-4 opacity-70" />
              <input
                type="password"
                placeholder="New Password"
                className="grow"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
            </label>
            {errors.password && (
              <p className="text-error text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <Lock className="size-4 opacity-70" />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="grow"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
              />
            </label>
            {errors.confirmPassword && (
              <p className="text-error text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner"></span>}
            {!loading && "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
