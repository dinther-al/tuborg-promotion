import { atom } from 'recoil'

export interface ErrorMessage {
  title: string;
  subtitle: string;
  imageUrl: string;
  message: string;
  countError: number
}

export const defaultErrorMessage = {
  title: 'Oh! Tiếc quá', 
  subtitle: 'Mã QR không hợp lệ!', 
  imageUrl:'https://res.cloudinary.com/dxjxqt01d/image/upload/v1716970120/image_webp_tp0owc.webp', 
  message:'Vui lòng kiểm tra lại', 
  countError: 0
}

export const errorMessageAtom = atom<ErrorMessage>({
  key: 'errorMessageAtom',
  default: defaultErrorMessage,
  // effects: [
  //   ({ onSet }) => {
  //     onSet((newValue) => {
  //       console.log("Current errorMessageAtom:", newValue);
  //     });
  //   },
  // ]
});