// HighlightBannerPreview.js

const HighlightBannerPreview = ({ displayType }) => {
  return (
    <div className="mt-4 overflow-hidden w-full h-24 relative bg-gray-300">
      {displayType === "scroll" && (
        <div className="flexbox animate-scroll-preview space-x-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-16 h-20 bg-gray-400 rounded-md flex-shrink-0"
              ></div>
            ))}
        </div>
      )}
      {displayType === "slide" && (
        <div className="flexbox animate-slide-preview">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-24 bg-gray-400 rounded-md flex-shrink-0"
              ></div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HighlightBannerPreview;