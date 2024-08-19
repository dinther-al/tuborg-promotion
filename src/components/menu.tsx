import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setRecoil } from 'recoil-nexus';
import { scanQRCode } from 'zmp-sdk';
import api from 'zmp-sdk';

import { qrIdInputAtom, qrSuccessAtom, verifyingAtom } from '../modules/utils/appConfig.recoil';
import { loadingAtom } from '../modules/utils/loading.recoil';
import { linkApp } from '../modules/utils/function';

const Menu = () => {
    const navigate = useNavigate();

    const openUrlInWebview = async () => {
        try {
            await api.openWebview({
                url: "https://www.tuborg.com/en/",
                config: {
                    style: "bottomSheet",
                    leftButton: "back",
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='min-h-28 w-full fixed bottom-0 flex justify-between text-white bg-menu'>
            <div className='flex flex-col justify-center items-center flex-1'>
                <div className='h-12 w-full flex justify-center items-center'>
                    <div className='rounded-full p-2 bg-[#01693A]'>
                        <img src="https://res.cloudinary.com/dupwtxgqt/image/upload/v1716630515/Group_10998_fibswg.png" className='w-6' />
                    </div>
                </div>
                <div className='text-xs'>Trang chủ</div>
            </div>
            <div className='flex flex-col justify-center items-center flex-1'
                onClick={openUrlInWebview}
            >
                <div className='h-12 w-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="#fff" viewBox="0 0 42 42">
                        <path d="M32.8763 3.95898H8.66797C7.29216 3.95898 5.9727 4.50552 4.99985 5.47837C4.02701 6.45121 3.48047 7.77067 3.48047 9.14648V26.4382C3.48047 27.814 4.02701 29.1334 4.99985 30.1063C5.9727 31.0791 7.29216 31.6257 8.66797 31.6257H13.5788C13.8385 31.6268 14.0947 31.6865 14.3282 31.8003C14.5616 31.9141 14.7665 32.0789 14.9276 32.2827L18.0746 36.2079C18.3987 36.6119 18.8093 36.9378 19.2762 37.1618C19.7431 37.3858 20.2543 37.5021 20.7721 37.5021C21.29 37.5021 21.8012 37.3858 22.2681 37.1618C22.735 36.9378 23.1456 36.6119 23.4696 36.2079L26.6167 32.2827C26.7778 32.0789 26.9826 31.9141 27.2161 31.8003C27.4496 31.6865 27.7057 31.6268 27.9655 31.6257H32.8763C34.2521 31.6257 35.5716 31.0791 36.5444 30.1063C37.5173 29.1334 38.0638 27.814 38.0638 26.4382V9.14648C38.0638 7.77067 37.5173 6.45121 36.5444 5.47837C35.5716 4.50552 34.2521 3.95898 32.8763 3.95898ZM20.7721 9.57878C21.1996 9.57878 21.6175 9.70554 21.973 9.94305C22.3284 10.1806 22.6055 10.5181 22.7691 10.9131C22.9327 11.308 22.9755 11.7426 22.8921 12.1619C22.8087 12.5812 22.6028 12.9663 22.3005 13.2686C21.9982 13.5709 21.6131 13.7768 21.1938 13.8602C20.7745 13.9436 20.3399 13.9008 19.945 13.7372C19.55 13.5736 19.2125 13.2965 18.9749 12.9411C18.7374 12.5856 18.6107 12.1677 18.6107 11.7402C18.6107 11.167 18.8384 10.6172 19.2438 10.2119C19.6491 9.8065 20.1989 9.57878 20.7721 9.57878ZM22.5013 26.4382H20.7721C20.3135 26.4382 19.8737 26.256 19.5494 25.9317C19.2251 25.6074 19.043 25.1676 19.043 24.709V19.5215C18.5844 19.5215 18.1445 19.3393 17.8203 19.015C17.496 18.6907 17.3138 18.2509 17.3138 17.7923C17.3138 17.3337 17.496 16.8939 17.8203 16.5696C18.1445 16.2453 18.5844 16.0632 19.043 16.0632H20.7721C21.2307 16.0632 21.6706 16.2453 21.9948 16.5696C22.3191 16.8939 22.5013 17.3337 22.5013 17.7923V22.9798C22.9599 22.9798 23.3997 23.162 23.724 23.4863C24.0483 23.8106 24.2305 24.2504 24.2305 24.709C24.2305 25.1676 24.0483 25.6074 23.724 25.9317C23.3997 26.256 22.9599 26.4382 22.5013 26.4382Z" fill="currentColor" />
                    </svg>
                </div>
                <div className='text-xs'>Thông tin</div>
            </div>
            <div className='flex flex-col justify-center items-center flex-1'
                onClick={() => {
                    scanQRCode({
                        success(res) {
                            if (res.content) {
                                const qrId = new URL(res.content).searchParams.get('qrId')
                                setRecoil(qrIdInputAtom, { qrId: qrId || "", scanTime: new Date() })
                                setRecoil(qrSuccessAtom, true)
                                setRecoil(loadingAtom, true)
                                navigate("/")
                            }
                        }
                    })
                }}
            >
                <div className='h-12 w-full flex justify-center items-center relative'>
                    <img src="https://res.cloudinary.com/dupwtxgqt/image/upload/v1717035776/scanqr_ogxhvg.png" className='w-[4.6rem] absolute -top-12' />
                </div>
                <div className='text-xs'>Quét QR</div>
            </div>
            <div className='flex flex-col justify-center items-center flex-1'
                onClick={() => linkApp("https://zalo.me/app/link/zapps/3508329490792790132/?cdpaid=6c565902a7311ada780b0305d1d47420-1712589046385&orgId=bdf66a48c3ebfaec10d2feb3492099ea&brandCode=carlsberg")}
            >
                <div className='h-12 w-full flex justify-center items-center'>
                    <svg width="34" height="34" viewBox="0 0 41 41" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.96056 4.26562C5.21033 4.26562 2.92969 6.48742 2.92969 9.22284V32.0029C2.92969 34.7383 5.21033 36.9601 7.96056 36.9601H33.0977C35.8479 36.9601 38.1286 34.7383 38.1286 32.0029V30.0362H31.5312C28.5931 30.0362 26.1861 27.639 26.1861 24.7009C26.1861 21.7628 28.5931 19.3558 31.5312 19.3558H38.1286V15.5034C38.1286 12.768 35.8479 10.5585 33.0977 10.5585H29.9525V9.22284C29.9525 6.48742 27.6841 4.26562 24.9339 4.26562H7.96056ZM7.96056 6.78229H24.9339C26.3623 6.78229 27.4481 7.86492 27.4481 9.22284V10.5585H5.44635V9.22284C5.44635 7.86492 6.53217 6.78229 7.96056 6.78229ZM31.5312 21.87C29.9425 21.87 28.7003 23.1122 28.7003 24.7009C28.7003 26.2896 29.9425 27.5319 31.5312 27.5319H38.1286V21.87H31.5312Z" fill="currentColor" />
                    </svg>
                </div>
                <div className='text-xs'>Ví quà</div>
            </div>
            <div className='flex flex-col justify-center items-center flex-1'
                onClick={() => linkApp("https://zalo.me/app/link/zapps/3544827160726001192/?cdpaid=5a05343a7c5ce4c672b20e28235690e9-1709687984875&orgId=d993891e4b2b04118c52b33f3e34e390&brandCode=Carlsberg")}
            >
                <div className='h-12 w-full flex justify-center items-center'>
                    <svg width="34" height="34" viewBox="0 0 35 42" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3648 0.751181C13.9259 0.710548 10.5564 1.71912 7.70539 3.64244C4.85438 5.56576 2.65737 8.31243 1.40727 11.5163C0.0745936 14.6832 -0.262851 18.1806 0.439778 21.5439C1.14241 24.9071 2.85184 27.9769 5.34093 30.3454L17.3648 41.9103L29.3362 30.3454C31.8253 27.9769 33.5347 24.9071 34.2374 21.5439C34.94 18.1806 34.6026 14.6832 33.2699 11.5163C32.0229 8.32087 29.834 5.58006 26.9934 3.65744C24.1528 1.73482 20.7948 0.721248 17.3648 0.751181ZM27.1989 25.6643H23.2653V28.2868H10.1531V16.9578C9.37976 16.4391 8.78308 15.6968 8.44272 14.83C8.10236 13.9633 8.03453 13.0133 8.24829 12.107C8.46205 11.2007 8.94722 10.3811 9.63901 9.75777C10.3308 9.13444 11.1963 8.73699 12.1199 8.61849C12.5735 7.79871 13.2384 7.11539 14.0454 6.63956C14.8525 6.16374 15.7723 5.91278 16.7092 5.91278C17.6461 5.91278 18.5659 6.16374 19.3729 6.63956C20.18 7.11539 20.8449 7.79871 21.2985 8.61849C22.3976 8.77987 23.4013 9.33338 24.1243 10.1769C24.8472 11.0203 25.2407 12.0969 25.2321 13.2078C25.2293 13.8896 25.0724 14.5619 24.7732 15.1746H27.1989V25.6643Z" fill="currentColor" />
                    </svg>
                </div>
                <div className='text-xs'>Tìm quán</div>
            </div>
        </div>
    );
};

export default Menu;