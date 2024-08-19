import { atom } from 'recoil';

export const deepLinkAtom = atom<string>({
  key: 'deepLinkAtom',
  default: "",
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current deepLinkAtom:", newValue);
      });
    },
  ]
})
