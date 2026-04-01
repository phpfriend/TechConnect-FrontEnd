import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constant";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      if (feed) return null;

      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      console.log("fetched data:", res.data.data[0]);
      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="text-6xl">👀</div>
        <h2 className="text-2xl font-semibold">You're all caught up!</h2>
        <p className="text-base-content/50 text-sm">
          No new users found. Check back later!
        </p>
      </div>
    );

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
