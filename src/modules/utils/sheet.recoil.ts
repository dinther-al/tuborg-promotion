import { atom } from 'recoil';

export const sheetStatsAtom = atom<boolean>({
  key: 'sheetStatsAtom',
  default: false,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current sheetStatsAtom:", newValue);
      });
    },
  ]
})

export const sheetHuntAtom = atom<boolean>({
  key: 'sheetHuntAtom',
  default: false,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current sheetHuntAtom:", newValue);
      });
    },
  ]
})