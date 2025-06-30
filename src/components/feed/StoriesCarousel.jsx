import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Story from "./Story.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

function StoriesCarousel() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const scrollRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const scrollAmount = 400; // Adjust for ~3-4 stories width

  const updateScrollPosition = () => {
    const container = scrollRef.current;
    if (container) {
      setAtStart(container.scrollLeft === 0);
      setAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(updateScrollPosition, 300); // Wait for scroll to update position
    }
  };

  useEffect(() => {
    updateScrollPosition();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollPosition);
      return () => container.removeEventListener("scroll", updateScrollPosition);
    }
  }, []);

  return (
    <div className="relative w-full max-w-80 md:max-w-3xl mx-auto sm:px-4 mt-3">
      {/* Left Arrow */}
      {!atStart && (
        <div
          className="hidden md:flex absolute left-0 top-[28%] transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white rounded-full p-1 cursor-pointer"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="text-black/40 w-6 h-6" />
        </div>
      )}

      {/* Scrollable Container */}
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

      {/* Right Arrow */}
      {!atEnd && (
        <div
          className="hidden md:flex absolute right-0 top-[28%] transform -translate-y-1/2 z-10 bg-white/40 hover:bg-white rounded-full p-1 cursor-pointer"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="text-black/40 w-6 h-6" />
        </div>
      )}
    </div>
  );
}

export default StoriesCarousel;
