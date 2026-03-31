import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constant";

const EditProfile = ({ setPreviewUser }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const formData = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviewUser({
        ...user,
        ...formData,
        skills: formData.skills
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [formData]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills?.join(", ") || "",
        about: user.about || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setError("");
    setSuccess(false);

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          ...data,
          skills: data.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.data));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || "Something went wrong!!");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-96 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center text-xl font-semibold">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First & Last Name */}
            <div className="flex gap-3 mt-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First name</span>
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="First name"
                  className="input input-bordered w-full rounded-md"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last name</span>
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Last name"
                  className="input input-bordered w-full rounded-md"
                />
              </div>
            </div>

            {/* Age */}
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text">Age</span>
              </label>
              <input
                {...register("age")}
                type="number"
                placeholder="Enter your age"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            {/* Gender */}
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                {...register("gender")}
                className="select select-bordered w-full rounded-md"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Photo URL */}
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                {...register("photoUrl")}
                type="url"
                placeholder="Enter photo URL"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            {/* Skills */}
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text">
                  Skills{" "}
                  <span className="text-xs text-gray-400">
                    (comma separated)
                  </span>
                </span>
              </label>
              <input
                {...register("skills")}
                type="text"
                placeholder="e.g. React, Node.js, MongoDB"
                className="input input-bordered w-full rounded-md"
              />
            </div>

            {/* About */}
            <div className="form-control w-full mt-2">
              <label className="label">
                <span className="label-text">About</span>
              </label>
              <textarea
                {...register("about")}
                placeholder="Tell something about yourself..."
                className="textarea textarea-bordered w-full rounded-md"
                rows={3}
              />
            </div>

            {/* Error & Success */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-2">
                Profile updated successfully!
              </p>
            )}

            {/* Button */}
            <div className="card-actions justify-center mt-6">
              <button
                type="submit"
                className="btn btn-primary rounded-md px-6 w-full"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
