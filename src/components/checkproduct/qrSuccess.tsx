import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIngestCDP, userInfoAtom } from '../../modules/userInfo/userInfo.recoil';
import { Checkbox } from 'zmp-ui';
import { useRecoilState, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import IconButton from '../../modules/widget/iconButton';
import { infoGiftAtom, popupAtom, qrSuccessAtom } from '../../modules/utils/appConfig.recoil';
import { follow, getPhoneNumbers, getUser } from '../../modules/userInfo/getInfoUser';
import { handleCheckboxChange } from '../../modules/utils/function';
import { eventBus } from 'personal-standard-ui-custom';

const QrSuccess = () => {
  const [userInfo] = useRecoilState(userInfoAtom);
  const infoGift = useRecoilValue(infoGiftAtom);

  const [agreeTerms, setAgreeTerms] = useState(userInfo.agreeTerms);
  const ingestCDP = useIngestCDP();

  useEffect(() => {
    if (userInfo.userId) {
      setRecoil(userInfoAtom, { ...userInfo, agreeTerms: true });
    }
  }, [userInfo.userId]);

  const handleGiftSelection = async () => {

    try {
      await getUser(true);
      await follow(ingestCDP);
      await getPhoneNumbers(true);

      setRecoil(qrSuccessAtom, false);
      if (infoGift.giftInfo.state === 'physical' && !userInfo.address && !userInfo.district) {
        eventBus.emit('bottomSheet1', {
          address: true
        })
        return;
      };

      setRecoil(popupAtom, true)
      handleCheckboxChange();
    } catch (error) {
      console.error("Error handling receive gift:", error);
    }
  };

  return (
    <AnimatePresence>
      <>
        <motion.div
          className='fixed z-50 bottom-0 top-0 right-0 left-0 bg-black bg-opacity-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.div
          className='fixed px-4 z-50 w-full'
          style={{
            top: window.innerHeight <= 750 ? `${window.innerHeight / 12}px` : '6rem'
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`bg-white pt-6 pb-6 px-8 rounded-3xl shadow-lg flex flex-col justify-start items-center ${!userInfo.userId ? 'min-h-[30rem]' : 'min-h-[28rem]'}`}>
            <p className="font-semibold mb-2">
              Chúc mừng bạn đã trúng
            </p>
            <h1 className="text-lg font-extrabold text-center min-h-12 line-clamp-2">
              {infoGift.giftInfo.message}
            </h1>
            <img
              className="mb-4"
              src={infoGift.giftInfo.image}
              alt="Tuborg T-Shirt"
              style={{ height: "13rem" }}
            />
            {!userInfo.userId &&
              <div className='flex gap-3'>
                <Checkbox
                  className='pl-2 mt-3'
                  value={agreeTerms.toString()}
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <label className='text-base'>
                  Tôi đã đọc, hiểu rõ và đồng ý với các {' '}
                  <span className='text-primaryColorAlpha border-b border-primaryColorAlpha'>điều khoản chương trình</span>
                </label>
              </div>
            }
            <IconButton
              onClick={handleGiftSelection}
              disabled={!agreeTerms}
              className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full mt-6 py-3 px-2 font-medium !text-base text-white'
            >
              Bấm để nhận ngay
            </IconButton>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default QrSuccess;
