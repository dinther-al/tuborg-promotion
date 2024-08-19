import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { dialogAtom } from '../utils/dialog.recoil';
import { useRecoilState } from 'recoil';
interface IDialog extends React.ComponentPropsWithoutRef<'div'> {
  close?: () => void;
}

const Dialog: React.FC<IDialog> = ({ close }) => {

  const [dialogState, setDialogState] = useRecoilState(dialogAtom);

  const dialogVariants = {
    closed: { opacity: 0, scale: 0.8, y: 100 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {dialogState.openDialog && (
        <div className="z-[99999] flex flex-col items-center justify-center fixed inset-0">
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => close ? close : setDialogState({ openDialog: false, dialogMessage: "" })}
            className="absolute inset-0 bg-[#0000004D] z-[-1]"></motion.div>
          <motion.div
            variants={dialogVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="bg-white p-4 rounded-lg min-h-40 w-full max-w-[80%] z-10 relative">
            <div className="font-semibold text-lg">Thông báo</div>
            <div className="text-base mt-2 line-clamp-2 w-full">{dialogState.dialogMessage}</div>
            <div className="text-base absolute left-0 right-0 ml-auto mr-auto bottom-4 text-center" onClick={() => setDialogState({ openDialog: false, dialogMessage: "" })}>OK</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;