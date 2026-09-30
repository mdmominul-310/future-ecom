"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  { id: 1, link: "/category/all", image: "/home/maven-thumb.png" },
  { id: 2, link: "/category/all", image: "/home/maven-watch.jpeg" },
];

export default function SwiperSlider() {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 5000 }}
      loop
      className="md:rounded-lg overflow-hidden"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <Link href={slide.link}>
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9]">
              <Image
                src={slide.image}
                alt={`Slide ${slide.id}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// // components/SwiperSlider.js
// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";
// import Image from "next/image";

// import "swiper/css";
// import "swiper/css/pagination";
// import { link } from "fs";
// import Link from "next/link";

// const slides = [
//   { id: 1, link: "/category/all", image: "/home/maven-thumb.png" },
//   { id: 2, link: "/category/all", image: "/home/maven-watch.jpeg" },
// ];

// export default function SwiperSlider() {
//   return (
//     <Swiper
//       pagination={{ dynamicBullets: true }}
//       modules={[Pagination, Autoplay]}
//       autoplay={{ delay: 5000 }}
//       loop
//       className="rounded-lg overflow-hidden"
//     >
//       {slides.map((slide) => (
//         <SwiperSlide key={slide.id}>
//           <Link href={slide.link}>
//             <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
//               <Image
//                 src={slide.image}
//                 alt={`Slide ${slide.id}`}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           </Link>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// }
