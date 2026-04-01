import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const avatarColors = [
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-amber-100 text-amber-800",
  "bg-teal-100 text-teal-800",
  "bg-blue-100 text-blue-800",
];

const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

// ✅ Moved outside Requests component
const RequestCard = ({ request, index, type, onAccept, onReject }) => {
  const person = type === "received" ? request.fromUserId : request.toUserId;
  const { firstName, lastName, photoUrl, age, gender, skills } = person;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
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

        {/* Actions */}
        {type === "received" ? (
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              className="btn btn-sm btn-primary rounded-md"
              onClick={() => onAccept(request._id)} // ✅ using props
            >
              Accept
            </button>
            <button
              className="btn btn-sm btn-outline rounded-md"
              onClick={() => onReject(request._id)} // ✅ using props
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="badge badge-warning badge-sm self-start flex-shrink-0">
            Pending
          </span>
        )}
      </div>
    </div>
  );
};

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        }),
        axios.get(BASE_URL + "/user/requests/sent", { withCredentials: true }),
      ]);

      setReceived(receivedRes.data.data || []);
      setSent(sentRes.data.data || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true },
      );
      setReceived((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true },
      );
      setReceived((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.log(err.message);
    }
  };

  const activeList = activeTab === "received" ? received : sent;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Requests</h2>
        <p className="text-sm text-base-content/50 mt-1">
          Manage your connection requests
        </p>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <div
          role="tab"
          className={`tab ${activeTab === "received" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received
          {received.length > 0 && (
            <span className="badge badge-sm badge-primary ml-2">
              {received.length}
            </span>
          )}
        </div>

        <div
          role="tab"
          className={`tab ${activeTab === "sent" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
          {sent.length > 0 && (
            <span className="badge badge-sm ml-2">{sent.length}</span>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : activeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-base font-medium">No {activeTab} requests</p>
          <p className="text-sm text-base-content/50">
            {activeTab === "received"
              ? "When someone is interested in you, it will show here"
              : "People you've shown interest in will appear here"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeList.map((request, index) => (
            <RequestCard
              key={request._id}
              request={request}
              index={index}
              type={activeTab}
              onAccept={handleAccept} // ✅ passing handlers as props
              onReject={handleReject} // ✅ passing handlers as props
            />
          ))}
        </div>
      )}
    </div> // ✅ closing main div
  ); // ✅ closing return
}; // ✅ closing component

export default Requests; // ✅ inside the file properly
