"use client";

// import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { TypewriterEffect } from "./TypewriterEffect";

export const HeroContainerScroll = () => {
  // const containerRef = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  // });
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth <= 768);
  //   };
  //   checkMobile();
  //   window.addEventListener("resize", checkMobile);
  //   return () => {
  //     window.removeEventListener("resize", checkMobile);
  //   };
  // }, []);

  // const scaleDimensions = () => {
  //   return isMobile ? [0.7, 0.9] : [1.05, 1];
  // };

  // const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  // const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  // const translateY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="flex items-center justify-center relative pt-32 ">
      <div className="w-full relative z-[9999]">
        <motion.div className="div max-w-5xl mx-auto text-center">
          {/* <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span> */}
          {/* <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-primary/0 via-primary/90 to-primary/0 transition-opacity duration-500 group-hover:opacity-40"></span> */}
          <p className="text-center font-medium mt-4 z-[99999]">
            <TypewriterEffect />
          </p>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="mb-8 text-[3.5rem] font-bold text-center sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] z-[9999]">
              AgencyFlow
            </h1>
          </div>
        </motion.div>
        <Image
          src="/assets/preview.png"
          alt="Banner preview"
          width={1200}
          height={1200}
          className="rounded-xl border-2 border-muted z-[9999]"
        />
      </div>
    </div>
  );
};

// interface CardProps {
//   rotate: any;
//   scale: any;
// }

// const Card = () => {
//   return (
//     // <motion.div className="max-w-5xl -mt-20 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-6 bg-background rounded-[30px] shadow-2xl">
//     <Image
//       src="/assets/preview.png"
//       alt="Banner preview"
//       width={1200}
//       height={1200}
//       className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
//     />
//     // </motion.div>
//   );
// };
