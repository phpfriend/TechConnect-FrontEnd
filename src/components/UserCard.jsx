import TinderCard from "react-tinder-card";
import { useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const [swipeDir, setSwipeDir] = useState(null);

  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const sendRequest = async (status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const onSwipe = (direction) => {
    setSwipeDir(direction);

    if (direction === "left") sendRequest("ignored");
    if (direction === "right") sendRequest("interested");

    // wait for animation
    setTimeout(() => {
      dispatch(removeUserFromFeed(_id));
    }, 300);
  };

  const swipe = async (dir) => {
    if (cardRef.current) {
      await cardRef.current.swipe(dir);
    }
  };

  return (
    <div className="swipe-container">
      <TinderCard
        ref={cardRef}
        onSwipe={onSwipe}
        onCardLeftScreen={() => setSwipeDir(null)}
        preventSwipe={["up", "down"]}
        className="swipe-card"
      >
        <div className="card bg-base-100 w-96 h-[480px] max-h-[90vh] shadow-2xl relative overflow-hidden">
          {/* 🔥 Overlay */}
          {swipeDir === "right" && (
            <div className="overlay like">CONNECT 🔗</div>
          )}
          {swipeDir === "left" && <div className="overlay nope">SKIP ❌</div>}

          <figure className="px-6 pt-6">
            <img
              src={photoUrl || "/default-user.png"}
              alt={firstName}
              onError={(e) => {
                e.target.src = "/default-user.png";
              }}
              className="rounded-xl h-64 object-contain w-full bg-base-200"
            />
          </figure>

          {/* 🔥 KEY CHANGE HERE */}
          <div className="card-body items-center text-center justify-between">
            {/* Top content */}
            <div>
              <h2 className="card-title text-xl font-bold">
                {firstName} {lastName}
              </h2>

              <p className="text-sm text-gray-500">
                {age}, {gender}
              </p>

              {/* 🔥 LIMIT TEXT */}
              <p className="text-sm line-clamp-3 overflow-hidden">{about}</p>
            </div>

            {/* Buttons always at bottom */}
            <div className="card-actions justify-center gap-6 mt-4">
              <button
                onClick={() => swipe("left")}
                className="btn btn-outline btn-error px-6"
              >
                ❌ Skip
              </button>

              <button
                onClick={() => swipe("right")}
                className="btn btn-primary px-6"
              >
                🔗 Connect
              </button>
            </div>
          </div>
        </div>
      </TinderCard>
    </div>
  );
};

export default UserCard;
