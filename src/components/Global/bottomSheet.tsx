import { BottomSheet } from 'personal-standard-ui-custom'
import { IBottomSheet } from 'personal-standard-ui-custom/dist/components/BottomSheet'
import React, { Suspense, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { isOpenSelectAddressAtom } from '../../modules/utils/appConfig.recoil'
import SearchAddress from '../SearchAddress'
import { handleInputBlur } from '../../modules/utils/function'


export const BottomSheetAddress = ({setValue}) => {

  const searchAddressRef = useRef<IBottomSheet>(null)
  const [isOpenSelectAddress, setIsOpenSelectAddress] = useRecoilState(isOpenSelectAddressAtom)

  const refs = {
    searchAddress: searchAddressRef,
  }

  useEffect(() => {
    if (isOpenSelectAddress) {
      refs.searchAddress.current?.open?.()
    } else {
      refs.searchAddress.current?.close?.()
    }
  }, [isOpenSelectAddress])

  return (
    <>
      <Suspense>
        <BottomSheet ref={searchAddressRef} setHeight={70} iconClose onClickIconClose={() => { setIsOpenSelectAddress(false), handleInputBlur() }}>
          <SearchAddress setValue={setValue}/>
        </BottomSheet>
      </Suspense>
    </>
  )
}
