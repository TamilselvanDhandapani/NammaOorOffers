import React, { useEffect, useRef, useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
 // ✅ Add your logo path here
import "../../styles/VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const { verifyOtp, resendOtp, user, message } = useAuth(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
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
      
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
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
  };

return (
  <div className="verify-container">
   

    <h2 className="verify-title">Verify OTP</h2>

    {message && <p className="verify-message">{message}</p>}

    <form onSubmit={handleSubmit} className="verify-form">
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className="otp-box"
            required
          />
        ))}
      </div>

      <button type="submit" className="verify-btn" disabled={verifying}>
        {verifying ? "Verifying..." : "Verify"}
      </button>
    </form>

    <div className="resend-section">
      {timer > 0 ? (
        <p className="timer-text">Resend OTP in {timer}s</p>
      ) : (
        <button
          onClick={handleResend}
          className="resend-btn"
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      )}
    </div>
  </div>
);

};

export default VerifyOtp;
