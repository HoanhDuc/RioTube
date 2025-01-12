"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          scale: 0.9,
          rotateX: 10,
          transformOrigin: "center center",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          transformOrigin: "center center",
        }}
        // exit={{
        //   opacity: 0,
        //   scale: 1.1,
        //   rotateX: -10,
        //   transformOrigin: "center center",
        // }}
        transition={{
          type: "tween",
          duration: 0.5,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
