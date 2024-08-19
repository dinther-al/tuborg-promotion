import { atom } from 'recoil';

type QrIdInputState = {
  qrId: string;
  scanTime: Date | null;
};

export const qrIdInputAtom = atom<QrIdInputState>({
  key: 'qrIdInputAtom',
  default:{qrId: "", scanTime: null},
  // effects: [
  //   ({ onSet }) => {
  //     onSet((newValue) => {
  //       console.log("Current qrIdInputAtom:", newValue);
  //     });
  //   },
  // ]
});