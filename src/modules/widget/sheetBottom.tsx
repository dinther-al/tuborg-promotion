import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { cn } from '../../utils/cn'

interface ISheetBottom extends React.ComponentPropsWithoutRef<'div'> {
  open: boolean
  close: () => void
  children: React.ReactNode
  height?: number
}

export const SheetBottom: React.FC<ISheetBottom> = ({ open, close, children, height }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className='z-[9999] flex flex-col items-center justify-end fixed inset-0'>
          <motion.div
            variants={{
              closed: { opacity: 0 },
              open: { opacity: 1 }
            }}
            initial='closed'
            animate='open'
            exit='closed'
            className='absolute inset-0 bg-[#0000004D] z-[-1]'
            onClick={close}
          ></motion.div>

          <motion.div
            transition={{
              type: 'spring',
              damping: 40,
              stiffness: 400
            }}
            variants={{
              open: { y: 0 },
              closed: { y: '100%' }
            }}
            initial='closed'
            animate='open'
            exit='closed'
            style={{ height: height ? `${height}px` : '50%' }}
            className={cn('absolute  bg-white w-full overflow-y-auto', {
              'rounded-t-lg': height && height < window.innerHeight
            })}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
