import { TCustomVoid, TVoid } from "./common";

export interface IDialog {
  id?: string;
  content: React.ReactNode;
  buttons?: {
    text: string;
    close?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
  }[];
  flex?: "row" | "col";
  title?: string;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface IDialogProps extends IDialog {
  getHandleOpen?: (value: TVoid) => void;
  getHandleClose?: (value: TVoid) => void;
  getHandleCloseCustom?: (value: TCustomVoid) => void;
  getSheetVisibility?: (value: boolean) => void;
}

export interface ICreate extends IDialog {}
