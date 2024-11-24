import React from "react";

export const EditProfile = () => {
  return (
    <div className="text-white ">
      <section>
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex item-center gap-2 ">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="text-black">
              <AvatarImage src={user?.profileImage} alt="post_image" />
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${user?._id}`}>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-400 text-sm ">
                {user?.bio || "Bio Here...."}
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
