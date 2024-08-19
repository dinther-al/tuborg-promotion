import { BottomSheet, eventBus } from 'personal-standard-ui-custom'
import { IBottomSheet } from 'personal-standard-ui-custom/dist/components/BottomSheet'
import React from 'react'
import UserConfirm from '../UserConfirm'

export const GlobalBottomSheet = () => {

  const addressRef = React.useRef<IBottomSheet>(null)

  const refs = {
    address: addressRef,
  }

  const handleBottomSheetEvent = (e) => {
    Object.entries(e).forEach(([key, isOpen]) => {
      const refToUse = refs[key]?.current
      if (refToUse) {
        setTimeout(() => {
          if (isOpen) {
            refToUse.open?.()
          } else {
            refToUse.close?.()
          }
        }, 100)
      }
    })
  }

  React.useEffect(() => {
    eventBus.on('bottomSheet1', handleBottomSheetEvent)
    return () => {
      eventBus.off('bottomSheet1', handleBottomSheetEvent)
    }
  }, [])

  return (
    <>
      <React.Suspense>
        <BottomSheet ref={addressRef} setHeight={80} title="">
          <UserConfirm />
        </BottomSheet>
      </React.Suspense>
    </>
  )
}