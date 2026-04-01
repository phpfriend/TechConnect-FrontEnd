import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constant";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center my-20 gap-3">
        <p className="text-2xl font-medium">No connections yet</p>
        <p className="text-base-content/50 text-sm">
          Start swiping to make connections!
        </p>
      </div>
    );
  }

  // helper — initials from name
  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  // cycle avatar bg colors for variety
  const avatarColors = [
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-amber-100 text-amber-800",
    "bg-teal-100 text-teal-800",
    "bg-blue-100 text-blue-800",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">My connections</h2>
        <p className="text-sm text-base-content/50 mt-1">
          {connections.length} {connections.length === 1 ? "person" : "people"}{" "}
          connected with you
        </p>
      </div>

      {/* Connection Cards */}
      <div className="flex flex-col gap-3">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, skills } =
            connection;

          return (
            <div
              key={_id}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body flex flex-row items-center gap-4 p-5">
                {/* Avatar */}
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0 ${
                      avatarColors[index % avatarColors.length]
                    }`}
                  >
                    {getInitials(firstName, lastName)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-base">
                    {firstName} {lastName}
                  </p>
                  <p className="text-sm text-base-content/50 mt-0.5">
                    {age && gender ? `${age} · ${gender}` : age || gender}
                  </p>

                  {/* Skills */}
                  {skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="badge badge-sm bg-teal-50 text-teal-800 border-0 font-normal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Button */}
                <button className="btn btn-sm btn-outline rounded-md self-start flex-shrink-0">
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
