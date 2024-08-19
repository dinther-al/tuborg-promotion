import { atom } from 'recoil';

interface Dialog {
  openDialog: boolean
  dialogMessage: string
}

export const dialogAtom = atom<Dialog>({
  key: 'dialogAtom',
  default: {
    openDialog: false,
    dialogMessage: ""
  },
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log("Current dialogAtom:", newValue);
      });
    },
  ]
})