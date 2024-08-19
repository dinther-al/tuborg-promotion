import { atom } from "recoil";

export const darkModeAtom = atom<any>({
  key: 'darkModeAtom',
  default: null,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current darkModeAtom:", newValue);
      });
    },
  ]
})