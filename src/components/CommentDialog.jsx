import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

function CommentDialog({ openComment, setOpenComment }) {
  return (
    <Dialog open={openComment}>
      <DialogContent
        className="bg-black text-white max-w-4xl p-0 flex flex-col"
        onInteractOutside={() => setOpenComment(false)}
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://plus.unsplash.com/premium_photo-1697477565728-d54c716b51d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-full rounded-lg object-cover"
              alt="post_image"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 ">
              <div className="flex gap-3 items-center ">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-black text-white">
                      IM
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs hover:text-gray-400">
                    username
                  </Link>{" "}
                  &nbsp;
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="bg-black text-white flex flex-col items-center text-sm text-center">
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit text-[#ED4956] font-bold rounded-xl hover:bg-gray-500"
                  >
                    Unfollow
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit   rounded-xl hover:bg-gray-500"
                  >
                    Add to Favourites
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit  rounded-xl hover:bg-gray-500"
                  >
                    About this account
                  </Button>
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit  rounded-xl font-bold hover:bg-gray-500"
                  >
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            <div className="flex flex-col flex-grow justify-between">
              <div className="overflow-y-auto max-h-96 p-4">
                comments ayenge comments ayenge
              </div>
              <div className="p-4 flex">
                <input
                  type="text"
                  placeholder="Add a comment...."
                  className="placeholder-white  text-white bg-black text-sm w-full outline-none border-gray-300 p-2 rounded"
                />
                <Button
                  variant="outline"
                  className="bg-black text-blue-500 border-none hover:bg-none hover:bg-black hover:text-blue-200 font-bold"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
