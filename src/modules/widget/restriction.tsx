import React from "react";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "../userInfo/userInfo.recoil";
const Restriction = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  if (!userInfo?.reachedMaxAct) return;
  return (
    <div className="fixed z-[9998] inset-0 flex flex-col justify-end items-center w-full">
      <div className="absolute z-10 flex justify-center gap-3 items-center bg-[#EB0F0F] pb-10 p-4 w-full text-white">
        <div>
          <p className="text-sm text-center">
            {userInfo?.reachedMaxActMessage || "Bạn đã tham gia trước đó"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Restriction;
