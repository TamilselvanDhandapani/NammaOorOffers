import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaBirthdayCake,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";


const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { createStoreUser, message } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await createStoreUser(
        username,
        email,
        password,
        phone,
        
        referralCode
      );
      if (success) navigate("/verify-otp");
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center min-h-[80vh] px-4">
      <Helmet>
        <title>Register | Namma Ooru Offers</title>
        <meta
          name="description"
          content="Create an account to explore offers and rewards in your city!"
        />
      </Helmet>

      <div className="bg-white shadow-md rounded-lg w-full max-w-md  py-4 px-6 space-y-6 border border-gray-200 mt-2 mb-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#4a6bff]">
            Create Your Store Account
          </h1>
          <p className="text-sm text-gray-600">
            Join us today to Grow your business!
          </p>
        </div>

        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="username"
            label="Username"
            icon={<FaUser />}
            value={username}
            onChange={setUsername}
            placeholder="Enter Store Owner's Name"
            required
          />

          <InputField
            id="email"
            type="email"
            label="Email"
            icon={<FaEnvelope />}
            value={email}
            onChange={setEmail}
            placeholder="Enter Store Email"
            required
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            icon={<FaLock />}
            value={password}
            onChange={setPassword}
            placeholder="Create Password"
            required
          />

          <InputField
            id="phone"
            type="tel"
            label="Phone Number"
            icon={<FaPhoneAlt />}
            value={phone}
            onChange={setPhone}
            placeholder="Enter Store's Phone Number"
            required
          />

         
          <InputField
            id="referal"
            label="Referral Code (optional)"
            icon={<FaGift />}
            value={referralCode}
            onChange={setReferralCode}
            placeholder="Referral code (if any)"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#4a6bff] text-white py-2 px-4 rounded hover:bg-[rgb(50,137,255)] transition duration-200"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              <>
                Register <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[rgb(50,137,255)] hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) => (
  <div>
    
    <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        type={type}
        id={id}
        className="w-full bg-transparent focus:outline-none text-gray-800"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  </div>
);

export default RegisterPage;
