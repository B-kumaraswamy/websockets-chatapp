import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail, setError } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Clear error when typing
    if (error) {
      setError(null); // ⬅ Clear the error message
    }

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const result = await verifyEmail(verificationCode);
      if (result.sucess === true) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Verify Your Email</h2>
          <p className="text-base-content/70">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 1) return; // prevent multiple characters
                  if (code.filter((c) => c !== "").length >= 6 && value) return; // block extra input after 6 digits
                  handleChange(index, value);
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="input input-bordered w-12 h-12 text-center text-lg font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onPaste={(e) => {
                  const pasted = e.clipboardData
                    .getData("text")
                    .slice(0, 6)
                    .split("");
                  const newCode = [...code];
                  for (let i = 0; i < 6; i++) {
                    newCode[i] = pasted[i] || "";
                  }
                  setCode(newCode);
                  setTimeout(() => {
                    const lastFilled = newCode.findIndex((val) => val === "");
                    const focusIndex = lastFilled === -1 ? 5 : lastFilled;
                    inputRefs.current[focusIndex]?.focus();
                  }, 0);
                  e.preventDefault();
                }}
              />
            ))}
          </div>

          {error && <p className="text-error text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="btn btn-primary btn-block"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
