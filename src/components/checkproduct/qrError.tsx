import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '../../modules/widget/iconButton';
import { setRecoil } from 'recoil-nexus';
import { qrIdInputAtom, qrSuccessAtom } from '../../modules/utils/appConfig.recoil';
import { loadingAtom } from '../../modules/utils/loading.recoil';
import { useNavigate } from 'react-router-dom';
import { scanQRCode } from 'zmp-sdk';

const QrError = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className='fixed z-50 bottom-0 top-0 right-0 left-0 bg-black bg-opacity-50'
            onClick={handleClose}
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
            <div className="bg-white pt-4 pb-2 px-10 rounded-3xl shadow-lg min-h-[26rem] flex flex-col justify-start items-center">
              <p className="font-semibold text-base text-center line-clamp-1">Oh! Tiếc quá</p>
              <h1 className="text-xl font-extrabold mb-2 text-center">Mã QR đã được sử dụng!</h1>
              <p className="font-semibold text-base text-center line-clamp-2">Vui lòng thử mã khác</p>
              <img className="mb-6 h-52 object-cover" src="https://res.cloudinary.com/dupwtxgqt/image/upload/v1717055262/img-1_ouaspg.png" alt="Tuborg T-Shirt" />

              <IconButton
                className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full my-3 py-3 font-medium !text-base text-white'
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
                Tiếp tục quét QR
              </IconButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QrError;
