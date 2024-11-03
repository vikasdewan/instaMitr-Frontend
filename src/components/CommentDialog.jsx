import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

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

          <div className="w-1/2 flex-col justify-between">
            <div className="flex items-center justify-start ">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
