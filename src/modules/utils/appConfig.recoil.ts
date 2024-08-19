import { atom, selector } from "recoil";
import { CodeGiftAPI, GiftAPI } from "../apis/appConfig.api";

export const verifyingAtom = atom<boolean>({
    key: "verifyingAtom",
    default: false,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current verifyingAtom:", newValue);
            });
        },
    ],
});

export const openPopupAtom = atom<boolean>({
    key: "openPopupAtom",
    default: true,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current openPopupAtom:", newValue);
            });
        },
    ],
});

export const qrSuccessAtom = atom<boolean>({
    key: "qrSuccessAtom",
    default: true,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current qrSuccessAtom:", newValue);
            });
        },
    ],
});

export const popupAtom = atom<boolean>({
    key: "popupAtom",
    default: false,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current popupAtom:", newValue);
            });
        },
    ],
});

export const checkboxCountAtom = atom<number>({
    key: "checkboxCountAtom",
    default: 0,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current checkboxCountAtom:", newValue);
            });
        },
    ],
});

export const isAddressFormVisibleAtom = atom<boolean>({
    key: "isAddressFormVisibleAtom",
    default: false,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current isAddressFormVisibleAtom:", newValue);
            });
        },
    ],
});

export const isOpenSelectAddressAtom = atom<boolean>({
    key: "isOpenSelectAddressAtom",
    default: false,
    // effects: [
    //   ({ onSet }) => {
    //     onSet((newValue) => {
    //       console.log("Current isOpenSelectAddressAtom:", newValue);
    //     });
    //   },
    // ]
});

export const isInputFocusedAtom = atom<boolean>({
    key: "isInputFocusedAtom",
    default: false,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current isInputFocusedAtom:", newValue);
            });
        },
    ],
});

export interface infoGiftProp {
    image: string;
    message: string;
    state: string;
}

export interface codeGiftProp {
    code: string;
    status: string;
}

export interface infoGiftState {
    giftInfo: infoGiftProp;
    codeGift: codeGiftProp;
}

export const infoGiftAtom = atom<infoGiftState>({
    key: "infoGiftAtom",
    default: {
        giftInfo: {
            image: "",
            message: "",
            state: "",
        },
        codeGift: {
            code: "",
            status: "",
        },
    },
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current infoGiftAtom:", newValue);
            });
        },
    ],
});

export const CodeGiftSelector = selector({
    key: "CodeGiftSelector",
    get: async ({}) => {
        try {
            const response: any = await CodeGiftAPI.getCodeGift();
            if (response) {
                return response;
            }
        } catch (error) {
            return;
        }
    },
});

export const codeGiftsAtom = atom({
    key: "codeGiftsAtom",
    default: CodeGiftSelector,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current codeGiftsAtom:", newValue);
            });
        },
    ],
});

export const GiftSelector = selector({
    key: "GiftSelector",
    get: async ({}) => {
        try {
            const response: any = await GiftAPI.getGift();
            if (response) {
                return response;
            }
        } catch (error) {
            return;
        }
    },
});

export const giftsAtom = atom<infoGiftProp[]>({
    key: "giftsAtom",
    default: GiftSelector,
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current giftsAtom:", newValue);
            });
        },
    ],
});

type QrIdInputState = {
    qrId: string;
    scanTime: Date | null;
};

export const qrIdInputAtom = atom<QrIdInputState>({
    key: "qrIdInputAtom",
    default: { qrId: "", scanTime: null },
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                // console.log("Current qrIdInputAtom:", newValue);
            });
        },
    ],
});