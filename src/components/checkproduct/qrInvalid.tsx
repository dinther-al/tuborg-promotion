import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from 'zmp-sdk';

import IconButton from '../../modules/widget/iconButton';
import { setRecoil } from 'recoil-nexus';
import { qrIdInputAtom, qrSuccessAtom } from '../../modules/utils/appConfig.recoil';
import { loadingAtom } from '../../modules/utils/loading.recoil';
import { useNavigate } from 'react-router-dom';
import { scanQRCode } from 'zmp-sdk';
import { errorMessageAtom } from '../../modules/utils/errorRecoil';
import { useRecoilValue } from 'recoil';
import ErrorMessage from '../errorMessage';

const QrError = () => {
  const navigate = useNavigate()
  const errorMessage = useRecoilValue(errorMessageAtom)
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleScanOrBack = () => {
    if (errorMessage.countError >= 10) {
      setRecoil(qrIdInputAtom, { qrId: "", scanTime: new Date() })
      setRecoil(loadingAtom, false)
      setIsOpen(false);
    } else {
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
    }
  }

  const handleBackOrClose = () => {
    if (errorMessage.countError >= 10) {
      api.closeApp({});
    } else {
      setRecoil(qrIdInputAtom, { qrId: "", scanTime: new Date() })
      setRecoil(loadingAtom, false)
      setIsOpen(false);
      navigate('/')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="bg-white pt-2 pb-4 px-10 rounded-3xl shadow-lg min-h-[24rem] flex flex-col justify-start items-center">
              <ErrorMessage />
              <IconButton
                className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full my-3 py-3 font-medium !text-base text-white'
                onClick={handleScanOrBack}
              >
                {errorMessage.countError >= 10 ? "Về màn hình chính" : "Thử quét lại mã"}
              </IconButton>
              <IconButton
                className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full my-3 py-3 font-medium !text-base text-white'
                onClick={handleBackOrClose}
              >
                {errorMessage.countError >= 10 ? "Đóng ứng dụng" : "Màn hình chính"}
              </IconButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QrError;
