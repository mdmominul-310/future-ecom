// components/NeumorphismSearch.tsx
import { Search } from "lucide-react"; // Make sure you've installed lucide-react

const NeumorphismSearch = () => {
  // Define colors as simple variables for inline styles, as per previous request
  const neumoBaseColor = "#e0e0e0";
  const neumoIconTextColor = "#8a8a8a";

  return (
    // Outer container for the neumorphic effect
    <div
      className="
        flex items-center
        rounded-full /* Tailwind's default full rounded corners */
        neumo-shadow-out /* Custom class from globals.css */
        p-2 /* Tailwind utility for padding */
      "
      style={{
        backgroundColor: neumoBaseColor, // Use inline style for background color matching neumo-base
      }}
    >
      <div className="relative flex items-center w-full">
        {/* Lucide Search Icon positioned absolute with Tailwind utilities */}
        <Search
          className="absolute left-4 w-5 h-5"
          style={{ color: neumoIconTextColor }} // Inline style for icon color
        />

        {/* The actual input field */}
        <input
          type="search"
          placeholder="Search for ..."
          className="
            flex-grow w-full
            pl-12 pr-5 py-3 /* Tailwind padding utilities */
            border-none outline-none
            rounded-full /* Match outer container's roundness */
            text-base text-gray-800 /* Tailwind text utilities */
            neumo-shadow-in /* Custom class from globals.css for inner shadow */
            neumo-placeholder /* Custom class for placeholder styling from globals.css */
            neumo-shadow-in-focus /* Custom class for focus styling from globals.css */
          "
          style={{
            backgroundColor: neumoBaseColor, // Inline style for input background color
          }}
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default NeumorphismSearch;
