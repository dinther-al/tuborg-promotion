import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const SkeletonPage = () => {
  return (
    <SkeletonTheme baseColor="#ebebeb">
      <div className="h-screen">
        <div className="fixed bottom-0 top-0 right-0 left-0">
          <div className="fixed w-full flex flex-col items-center justify-center" style={{ top: `${window.innerHeight / 2 - 50}px` }}>
            <div className="bg-image">
            </div>
            <div className="text-[#D4F980] text-lg font-bold mt-2">Welcome to Tuborg UTC...</div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonPage;