import { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import UserCard from "./UserCard";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const [previewUser, setPreviewUser] = useState(user);

  return (
    <div className="flex justify-center gap-10 my-10">
      <EditProfile setPreviewUser={setPreviewUser} />
      <UserCard user={previewUser || user} />
    </div>
  );
};

export default Profile;
