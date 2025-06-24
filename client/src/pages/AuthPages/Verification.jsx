import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const Verification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const { verifyOtp, resendOtp, user, message, loading } = useAuth();

  // ✅ Redirect if no pending registration
  useEffect(() => {
    const checkPendingUser = () => {
      const pendingUserId = localStorage.getItem("pendingUserId");
      if (!pendingUserId && !loading) {
        toast.info("Please register first.");
        navigate("/register");
      }
    };

    // Delay check slightly for hydration safety
    setTimeout(checkPendingUser, 100);
  }, [loading, navigate]);
  // ✅ Focus first input after component mounts
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // ✅ Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, ""); // allow only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    const enteredOtp = otp.join("");
    const success = await verifyOtp(enteredOtp);
    if (success) {
      navigate(user?.role === "admin" ? "/admin-dashboard" : "/");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    setVerifying(false);
  };

  const handleResend = async () => {
    setResending(true);
    await resendOtp();
    setOtp(new Array(6).fill(""));
    setTimer(60);
    setResending(false);
    inputsRef.current[0]?.focus();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#4a6bff] mb-2">Verify OTP</h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-10 h-12 text-xl text-center border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4a6bff] outline-none"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#4a6bff] hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-600">Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-[#4a6bff] hover:underline disabled:opacity-50"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verification;
