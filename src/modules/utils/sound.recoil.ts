import { atom } from 'recoil';

export const soundSpinAtom = atom<any>({
  key: 'soundSpinAtom',
  default: null,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current soundSpinAtom:", newValue);
      });
    },
  ]
})

export const soundResultAtom = atom<any>({
  key: 'soundResultAtom',
  default: null,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current soundResultAtom:", newValue);
      });
    },
  ]
})
