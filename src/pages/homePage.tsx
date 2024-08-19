import React, { useEffect, useState } from 'react';
import { setRecoil } from 'recoil-nexus';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getQueryParam, getRandomInt, handleCheckboxChange } from '../modules/utils/function';
import { isAddressFormVisibleAtom, codeGiftsAtom, giftsAtom, infoGiftAtom, popupAtom, qrIdInputAtom, qrSuccessAtom, verifyingAtom } from '../modules/utils/appConfig.recoil';
import _ from "lodash"
import { loadingAtom } from '../modules/utils/loading.recoil';
import Header from '../components/header';
import Menu from '../components/menu';
import QrSuccess from '../components/checkproduct/qrSuccess';
import Popup from '../components/Popup';
import QrError from '../components/checkproduct/qrError';
import { useForm } from 'react-hook-form';
import { userInfoAtom } from '../modules/userInfo/userInfo.recoil';
import { errorMessageAtom } from '../modules/utils/errorRecoil';
import QrInvalid from '../components/checkproduct/qrInvalid';
import { GlobalBottomSheet } from '../components/Global/bottomSheet1';

const HomePage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [verifying, setVerifying] = useRecoilState(verifyingAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const isPopup = useRecoilValue(popupAtom);
  const isAddressFormVisible = useRecoilValue(isAddressFormVisibleAtom);
  const CodeGifts = useRecoilValue(codeGiftsAtom)
  const gifts = useRecoilValue(giftsAtom)
  const infoGift = useRecoilValue(infoGiftAtom);
  const qrIdInput = useRecoilValue(qrIdInputAtom);
  const isQrSuccess = useRecoilValue(qrSuccessAtom)
  const errorMessage = useRecoilValue(errorMessageAtom)

  const [validCode, setValidCode] = useState(false);
  const [height, setHeight] = useState(window.innerHeight - 160);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 160);
    };
    setTopOffset(window.innerHeight / 2 - 50);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (loading || verifying) {
      const timer = setTimeout(() => {
        if (loading) setLoading(false);
        if (verifying) setVerifying(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
    return;
  }, [loading, verifying]);


  useEffect(() => {
    const qrId = getQueryParam('qrId') || qrIdInput.qrId;
    // const qrId = "kLmNoPqRsT";

    const randomGift = gifts[getRandomInt(gifts.length)];
    const foundCode = CodeGifts.find((id) => id.code === qrId);

    if (!foundCode) {
      const updatedErrorCount = errorMessage.countError + 1;
      setValidCode(false);

      if (errorMessage.countError === 9) {
        setRecoil(errorMessageAtom, {
          title: 'Bạn bị tạm khóa',
          subtitle: 'Mã sai 10 lần liên tục',
          imageUrl: 'https://res.cloudinary.com/dxjxqt01d/image/upload/v1716970415/image_webp_magwlc.webp',
          message: 'Vui lòng quay lại sau 24 giờ!',
          countError: updatedErrorCount
        });

      } else {
        setRecoil(errorMessageAtom, {
          ...errorMessage,
          countError: updatedErrorCount
        });
      }
    } else {
      setRecoil(infoGiftAtom, {
        ...infoGift,
        giftInfo: foundCode.status === "issued" ? randomGift : { image: "", message: "", state: "" },
      });
      setValidCode(true);
    }
  }, [qrIdInput]);

  const saveData = (data) => {
    console.log(data);
    setRecoil(isAddressFormVisibleAtom, false);
    setRecoil(userInfoAtom, { ...userInfo, ...data })
    setRecoil(qrSuccessAtom, false);
    setRecoil(popupAtom, true);
    handleCheckboxChange();
  };

  const methods = useForm({
    defaultValues: {
      address: userInfo.address || "",
      region: `${userInfo.ward ? userInfo.ward + ', ' : ''}${userInfo.district ? userInfo.district + ', ' : ''}${userInfo.province ? userInfo.province : ''}` || "",
    }
  });

  const onSubmit = methods.handleSubmit(saveData);

  return (
    loading ? (
      <div className="h-screen">
        <div className="fixed bottom-0 top-0 right-0 left-0">
          <div className="fixed w-full flex flex-col items-center justify-center" style={{ top: `${topOffset}px` }}>
            <div className="bg-image relative overflow-hidden">
              <div className="fill-animation absolute inset-0"></div>
            </div>
            <div className="text-[#D4F980] text-lg font-bold mt-2">Welcome to Tuborg UTC...</div>
          </div>
        </div>
      </div>
    ) : (
      <div className='h-screen'>
        <GlobalBottomSheet />
        <Header />
        <div
          className='bg-no-repeat bg-cover bg-[center_top] fixed bottom-0 w-full'
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dupwtxgqt/image/upload/v1716620362/banner_tqtrwj.png')",
            height: `${height}px`
          }}
        />
        {validCode ? (
          !_.isEmpty(infoGift.giftInfo.message) &&
            !_.isEmpty(infoGift.giftInfo.image)
            ? (isQrSuccess ? <QrSuccess /> : "") : (<QrError />)
        ) : (
          <QrInvalid />
        )}
        {isPopup && <Popup />}
        {verifying ? (
          <div className='absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-55'>
            <div className='fixed bottom-32 w-full flex flex-col items-center'>
              <div className="h-5 rounded-full overflow-hidden border-2 border-[#D4F980] w-48 p-0.5 shadow-xl mb-3">
                <div className="h-full bg-gradient-to-r from-[#A0D035] to-[#DBFF8B] animate-load w-full rounded-full"></div>
              </div>
              <div className='text-white'>Đang xác thực mã...</div>
            </div>
          </div>
        ) : (
          <Menu />
        )}
      </div>
    )
  );
};

export default HomePage;
