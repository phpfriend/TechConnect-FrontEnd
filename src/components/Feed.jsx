import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constant";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const fetchFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] gap-3">
        <div className="text-6xl">👀</div>
        <h2 className="text-2xl font-semibold">You're all caught up!</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-128px)] overflow-hidden bg-base-200">
      <UserCard key={feed[0]._id} user={feed[0]} />
    </div>
  );
};

export default Feed;
