import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signUp",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data || "Something went wrong!!");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-md">
        <div className="card-body">
          {/* Title */}
          <h2 className="card-title justify-center text-xl font-semibold">
            Create an account
          </h2>

          {/* First & Last Name */}
          <div className="flex gap-3 mt-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">First name</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full rounded-md"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Last name</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full rounded-md"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control w-full mt-2">
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

          {/* Password */}
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

          {/* Error */}
          <p className="text-red-500 text-sm mt-1">{error}</p>

          {/* Button */}
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary rounded-md px-6 w-full"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-base-content/50 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
