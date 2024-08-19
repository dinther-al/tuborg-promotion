import { TCustomVoid, TVoid } from "./common";

export type TArrowBottomSheet = "straight" | "up" | "down";
export type TDragHandle = "content" | "header" | "footer" | "mask";

export interface IBottomSheet {
  id?: string;
  content: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  iconClose?: boolean;
  dragHandle?: TDragHandle[];
  onClose?: TVoid;
  onOpen?: TVoid;
  darkMode?: boolean;
  maskClosable?: boolean;
  debug?: boolean;
  height?: number;
}

export interface IBottomSheetProps extends IBottomSheet {
  getHandleOpen?: (value: TVoid) => void;
  getHandleClose?: (value: TVoid) => void;
  getHandleCloseCustom?: (value: TCustomVoid) => void;
  getSheetVisibility?: (value: boolean) => void;
}

export interface ICreate extends IBottomSheet {}

export interface ISheetInfo {
  [key: string]: {
    close?: TVoid;
    open?: TVoid;
    visibility?: boolean;
    closeCustom?: TCustomVoid;
  };
}
