"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DiscountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    // Only trigger modal if we're on /home
    if (pathname === "/") {
      // Use sessionStorage to track per visit
      const hasShownModal = sessionStorage.getItem("hasShownDiscountModal");

      if (!hasShownModal) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("hasShownDiscountModal", "true");
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative max-w-md w-full mx-4 overflow-hidden rounded-lg">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 text-black"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative bg-white rounded-lg overflow-hidden">
          <Link
            href={`/category/all`}
            className="block relative w-full aspect-[16/9]"
          >
            <div className="relative w-full h-full">
              <Image
                src="/home/maven-thumb.png"
                alt="Special discount offer"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { X } from "lucide-react";
// import Link from "next/link";

// export default function DiscountModal() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//     // Show modal after 2 seconds
//     const timer = setTimeout(() => {
//       setIsOpen(true);
//       console.log("Modal should be visible now");
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   // Don't render anything during SSR
//   if (!isMounted) return null;

//   // Don't render if modal is closed
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
//       <div className="relative max-w-md w-full mx-4 overflow-hidden rounded-lg">
//         {/* Close button */}
//         <button
//           onClick={() => setIsOpen(false)}
//           className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 text-black"
//           aria-label="Close"
//         >
//           <X className="h-6 w-6" />
//         </button>

//         {/* Modal content */}
//         <div className="relative bg-white rounded-lg overflow-hidden">
//           <Link
//             href={`/category/all`}
//             className="block relative w-full aspect-[16/9]"
//           >
//             <div className="relative w-full h-full">
//               <Image
//                 src="/home/maven-thumb.png"
//                 alt="Special discount offer"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
