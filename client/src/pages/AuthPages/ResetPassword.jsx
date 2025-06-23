import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, message, error } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirm) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirm) {
      alert("Passwords don't match");
      return;
    }

    const success = await resetPassword({ token, newPassword });
    if (success) navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#4a6bff] mb-2">
            🔐 Reset Password
          </h2>
          <p className="text-sm text-gray-500">Enter and confirm your new password</p>
        </div>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded ${
              error ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type={show ? "text" : "password"}
              aria-label="New password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a6bff]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={show ? "text" : "password"}
              aria-label="Confirm new password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4a6bff]"
              required
            />
            {newPassword && confirm && newPassword !== confirm && (
              <p className="text-xs text-red-600 mt-1">⚠️ Passwords don’t match</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="text-sm text-[#4a6bff] hover:underline"
            >
              {show ? "Hide Passwords" : "Show Passwords"}
            </button>
            <button
              type="submit"
              className="bg-[#4a6bff] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
