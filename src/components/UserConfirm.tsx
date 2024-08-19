import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { InputAddress } from './form-elements/input';
import { Input } from 'zmp-ui';
import { useRecoilState } from 'recoil';
import { setRecoil } from 'recoil-nexus';

import { isOpenSelectAddressAtom, popupAtom } from '../modules/utils/appConfig.recoil';
import { Field } from './form-elements/field';
import { userInfoAtom } from '../modules/userInfo/userInfo.recoil';
import { handleCheckboxChange, handleInputBlur, handleInputFocus } from '../modules/utils/function';
import { BottomSheetAddress } from './Global/bottomSheet';
import IconButton from '../modules/widget/iconButton';
import { eventBus } from 'personal-standard-ui-custom';

const UserConfirm = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [isOpenSelectAddress, setIsOpenSelectAddress] = useRecoilState(isOpenSelectAddressAtom)

  const handleSearchAddress = async (type?: string) => {
    const province = userInfo.province
    const district = userInfo.district

    switch (type) {
      case 'thanhpho':
        setUserInfo({ ...userInfo, rootType: type })
        break
      case 'quanhuyen':
        setUserInfo({ ...userInfo, rootType: province ? type : 'thanhpho' })
        break
      case 'xaphuong':
        if (!province) {
          setUserInfo({ ...userInfo, rootType: 'thanhpho' })
        } else if (province && !district) {
          setUserInfo({ ...userInfo, rootType: 'quanhuyen' })
        } else if (province && district) {
          setUserInfo({ ...userInfo, rootType: type })
        }
        break
      default:
        break
    }
    setIsOpenSelectAddress(true)
  }

  const rootType = () => {
    const { province, district, ward } = userInfo;
    let searchType = 'thanhpho';

    if (!province) {
      searchType = 'thanhpho';
    } else if (!district) {
      searchType = 'quanhuyen';
    } else if (!ward) {
      searchType = 'xaphuong';
    }
    return searchType
  };

  const saveData = (data) => {
    console.log(data);
    eventBus.emit('bottomSheet1', {
      address: false
    })
    setRecoil(userInfoAtom, { ...userInfo, ...data })
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
    <React.Suspense>

      <div className='pb-24 px-6'>
        <div className='flex flex-col items-center w-full'>
          <h1 className="text-xl font-extrabold mb-1 text-center">Nơi nhận quà</h1>
          <p className="font-semibold mb-2 text-base text-center">Nhập địa chỉ của bạn để chúng tôi gửi quà nhé, quà có thể được gửi đến bạn trong 5-7 ngày!</p>
          <div className='mt-3 w-full'>
            <Field
              label={
                <span className="font-bold text-sm">
                  Địa chỉ <span className="text-primaryColor">*</span>
                </span>
              }

              error={methods.formState.errors?.address}
            >

              <Controller
                name="address"
                control={methods.control}
                rules={{ required: "Vui lòng nhập Địa chỉ" }}
                render={({ field }) => (
                  <InputAddress
                    placeholder="Ví dụ: 215 đường Hồng Bàng"
                    {...field}
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                  />
                )}
              />
            </Field>
          </div>
          <div className='mt-3 w-full'>
            <Field
              label={
                <span className="font-bold text-sm">
                  Phường/Xã, Quận/Huyện, Tỉnh/Thành Phố <span className="text-primaryColor">*</span>
                </span>
              }

              error={methods.formState.errors?.region}
            >
              <Controller
                name="region"
                control={methods.control}
                rules={{ required: "Yêu cầu nhập Địa chỉ" }}
                render={({ field }) => (
                  <>
                    <InputAddress
                      readOnly
                      {...field}
                      value={`${userInfo.ward ? userInfo.ward + ', ' : ''}${userInfo.district ? userInfo.district + ', ' : ''}${userInfo.province ? userInfo.province : ''}`}
                      placeholder='Chọn Tỉnh/Thành phố'
                      onClick={() => {
                        handleSearchAddress(rootType());
                      }}
                      onFocus={handleInputFocus}
                    />
                    {isOpenSelectAddress && <BottomSheetAddress setValue={field.onChange} />}
                  </>
                )}
              />

            </Field>
          </div>
          <div className='w-full mt-3'>
            <label htmlFor='current-address' className='text-[.875rem] font-semibold'>
              Ghi chú
            </label>
            <Input.TextArea
              className='h-16 line-clamp-1'
              placeholder='Ghi chú của bạn cho chúng tôi'
            />
          </div>
          <IconButton
            className='bg-gradient-to-r from-blue-700 to-green-500 rounded-full w-full mt-8 py-3 px-2 font-medium !text-base text-white'
            onClick={onSubmit}
          >
            Lưu và tiếp tục
          </IconButton>
        </div>
      </div>
    </React.Suspense>
  );
};

export default UserConfirm;
