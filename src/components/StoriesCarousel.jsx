import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Story from "./Story.jsx";

function StoriesCarousel() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 140;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-80 md:max-w-3xl mx-auto sm:px-4 mt-3">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-x-3 sm:gap-x-4 h-24 md:h-28 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex-shrink-0">
            <Story user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesCarousel;
