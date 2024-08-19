import { atom } from 'recoil';

export const loadingAtom = atom<boolean>({
  key: 'loadingAtom',
  default: true,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        // console.log("Current loadingAtom:", newValue);
      });
    },
  ]
})
