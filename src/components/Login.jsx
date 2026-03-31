import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login", // correct endpoint
        {
          emailId: emailId,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response.data || "Something went wrong!!");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-md">
        <div className="card-body">
          {/* Title */}
          <h2 className="card-title justify-center text-xl font-semibold">
            Login
          </h2>

          {/* Email Field */}
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Email Id</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="input input-bordered w-full rounded-md"
            />
          </div>

          {/* Password Field */}
          <div className="form-control w-full mt-2">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full rounded-md"
            />
          </div>

          {/* Button */}
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center mt-6">
            <button
              className="btn btn-primary rounded-md px-6 w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
