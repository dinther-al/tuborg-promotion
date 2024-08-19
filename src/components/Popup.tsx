import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import IconButton from '../modules/widget/iconButton';
import { infoGiftAtom, popupAtom, qrIdInputAtom, qrSuccessAtom, verifyingAtom } from '../modules/utils/appConfig.recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { scanQRCode } from 'zmp-sdk';
import { setRecoil } from 'recoil-nexus';
import { loadingAtom } from '../modules/utils/loading.recoil';
import { useNavigate } from 'react-router-dom';

const Popup = () => {
  const navigate = useNavigate()
  const [isPopup, setIsPopup] = useRecoilState(popupAtom);
  const infoGift = useRecoilValue(infoGiftAtom);

  return (
    <AnimatePresence>
      <>
        <motion.div
          className='fixed z-50 bottom-0 top-0 right-0 left-0 bg-black bg-opacity-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        ></motion.div>
        <motion.div
          className='absolute top-24 px-4 z-50 w-full'
          style={{
            ...(window.innerHeight <= 750 ?
              { top: `${window.innerHeight / 12}px` } :
              ""
            )
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        >
          <div
            className="bg-white pt-6 pb-2 px-8 rounded-3xl shadow-lg min-h-[31rem] flex flex-col justify-start items-center"
            style={{ minHeight: window.innerHeight < 750 ? "33rem" : "31rem" }}
          >
            <h1 className="text-xl font-extrabold mb-2 text-center">Nhận thành công!</h1>
            <p className="font-semibold text-lg mb-4 text-center">Quà tặng đã được lưu vào ví của bạn</p>
            <img className="mb-5 h-36" src={infoGift.giftInfo.image} alt="Tuborg T-Shirt" />
            <p className="font-semibold text-lg text-center min-h-14 line-clamp-2">{infoGift.giftInfo.message}</p>
            <div className='w-full mt-2'>
              <IconButton
                className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full mt-6 py-3 px-2 font-medium !text-base text-white'
                onClick={() => {
                  setRecoil(verifyingAtom, true);
                  setIsPopup(!isPopup);
                }}
              >
                Xem ví quà của bạn
              </IconButton>
              <IconButton
                className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full mt-4 py-3 px-2 font-medium !text-base text-white'
                onClick={() => {
                  scanQRCode({
                    success(res) {
                      if (res.content) {
                        const qrId = new URL(res.content).searchParams.get('qrId')
                        setRecoil(qrIdInputAtom, { qrId: qrId || "", scanTime: new Date() })
                        setRecoil(qrSuccessAtom, true)
                        setRecoil(loadingAtom, true)
                        setIsPopup(!isPopup);
                        navigate("/")
                      }
                    }
                  })
                }}
              >
                Tiếp tục quét mã để nhận thưởng
              </IconButton>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence >
  )
}

export default Popup
