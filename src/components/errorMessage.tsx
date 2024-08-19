import React from 'react';
import { useRecoilValue } from 'recoil';
import { errorMessageAtom } from '../modules/utils/errorRecoil';

const ErrorMessage = () => {
  const errorMessage = useRecoilValue(errorMessageAtom)
  return(
    <div className='w-full h-max bg-white z-50 flex flex-col items-center rounded-md p-2 font-medium'>
      <div className='text-base'>{errorMessage.title}</div>
      <div className='font-bold text-center text-base'>{errorMessage.subtitle}</div>
      <img src={errorMessage.imageUrl} alt='' className='w-72 my-2' />
      <div className='text-base'>{errorMessage.message}</div>
    </div>
  )
};

export default ErrorMessage;
