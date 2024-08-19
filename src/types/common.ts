export type TVoid = () => void;
export type TCustomVoid = (cb: TVoid) => void;

export interface ICloseOptions {
  id?: string;
  callback?: TVoid;
}
