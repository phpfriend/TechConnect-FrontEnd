import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { addFeed } from "../utils/feedSlice"; // ✅ import action
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

      console.log("fetched data:", res.data.data[0]); // ✅ correct access
      dispatch(addFeed(res.data.data)); // ✅ correct dispatch
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
