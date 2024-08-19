import React from 'react';
import { greeting, linkApp, shareLink } from '../modules/utils/function';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfoAtom } from '../modules/userInfo/userInfo.recoil';
import { checkboxCountAtom } from '../modules/utils/appConfig.recoil';
import IconButton from '../modules/widget/iconButton';

const Header = () => {
    const userInfo = useRecoilValue(userInfoAtom)
    const [checkboxCount, setCheckboxCount] = useRecoilState(checkboxCountAtom);

    const handleGiftHunt = () => {
        linkApp("https://zalo.me/s/352090850508061142/")
        setCheckboxCount(0);
    }

    return (
        <div className="bg-[#22419B] p-4 shadow-lg border-b-4 border-green-400 h-40">
            <div className="flex flex-col justify-between r">
                <h1 className='text-white text-xl font-bold mb-2 line-clamp-1'>{greeting()}{userInfo.userId ? `, ${userInfo.userName}` : ""}!</h1>
                <div className='flex items-center justify-between px-2 mb-1'>
                    <div className="flex justify-start items-baseline">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index}>
                                {index < checkboxCount ? (
                                    <img src="https://res.cloudinary.com/dupwtxgqt/image/upload/v1716949003/image_247_r1a2to.png" alt="tick" className="w-10 h-10 rounded-full mx-1 object-cover" />) : <div className="w-9 h-9 bg-[#B5D457] bg-opacity-50 rounded-full mx-1"></div>}
                            </div>
                        ))}
                    </div>

                    <div onClick={() => shareLink("https://zalo.me/s/4352031027937862044/?qrId=default&env=TESTING&version=2")}>
                        <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.2479 8.58153L11.6011 0.934766C11.2687 0.602215 10.929 0.433594 10.5916 0.433594C10.1234 0.433594 9.57665 0.784473 9.57665 1.77304V6.48784C7.24263 6.64678 5.07108 7.63857 3.41184 9.31511C1.61976 11.1258 0.632812 13.5261 0.632812 16.0738C0.632812 17.1711 0.816977 18.2488 1.18047 19.277C1.25994 19.5019 1.47269 19.6523 1.71126 19.6523C1.94997 19.6523 2.16258 19.5019 2.2422 19.277C3.36008 16.1142 6.26375 13.9097 9.57665 13.648V18.3128C9.57665 19.3013 10.1233 19.6522 10.5916 19.6522C10.929 19.6522 11.2686 19.4837 11.601 19.1513L19.248 11.5043C19.6372 11.115 19.8516 10.596 19.8516 10.0428C19.8514 9.48974 19.637 8.97068 19.2479 8.58153ZM18.4517 10.7081L10.8048 18.3551C10.7687 18.3911 10.7366 18.4198 10.7088 18.4425C10.7049 18.4067 10.7026 18.3638 10.7026 18.3129V13.0592C10.7026 12.9089 10.6425 12.7647 10.5354 12.6589C10.43 12.5547 10.2878 12.4962 10.1395 12.4962C10.1375 12.4962 10.1354 12.4963 10.1334 12.4963C8.12811 12.5186 6.21316 13.1525 4.59557 14.3292C3.46243 15.1535 2.5356 16.1972 1.8617 17.3978C1.79337 16.9619 1.75891 16.5198 1.75891 16.0738C1.75891 11.4482 5.52122 7.64326 10.1459 7.5918C10.4544 7.58843 10.7027 7.3374 10.7027 7.02875V1.77304C10.7027 1.72216 10.7051 1.67934 10.7088 1.64342C10.7366 1.66614 10.7687 1.69488 10.8048 1.73095L18.4517 9.37787C18.6283 9.55441 18.7255 9.79048 18.7255 10.043C18.7253 10.2953 18.6281 10.5315 18.4517 10.7081Z" fill="white" />
                        </svg>
                    </div>
                </div>

                <div className='w-56'>
                    {checkboxCount === 5 ?
                        <IconButton
                            className="bg-green-500 rounded-full w-full p-1 font-medium !text-xl text-white"
                            onClick={() => handleGiftHunt()}
                        >
                            Quay săn quà ngay
                        </IconButton> :
                        <p className="text-white text-center text-xs line-clamp-2 mt-2">
                            Quét đủ 05 mã QR sẽ nhận được 01 lượt quay may mắn săn quà hấp dẫn!
                        </p>}
                </div>

            </div>

            <div className='absolute top-20 right-4 w-28 h-28 z-20'>
                {!userInfo.userAvatar ? (
                    <div className="w-28 h-28 rounded-full border-[0.5px] border-green-600 p-1 flex-shrink-0">
                        <div className="w-full h-full rounded-full module-border-wrap overflow-hidden">
                            <img
                                src={userInfo.userAvatar}
                                alt="User Avatar"
                                className='rounded-full'
                            />
                        </div>
                    </div>
                ) : (
                    <div className='rounded-full'>
                        <img
                            src="https://res.cloudinary.com/dupwtxgqt/image/upload/v1716629881/avatar_uspvl5.png"
                            alt="User Avatar"
                            className='rounded-full'
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;