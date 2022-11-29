import { CUBE_RANK } from '@utils/constants';

export type CubeRankType = typeof CUBE_RANK[keyof typeof CUBE_RANK];

export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

export type ClickEvent = React.MouseEvent<HTMLElement>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type FormEvent = React.FormEvent<HTMLFormElement>;
export interface LanguageMap {
  [key: string]: string;
}
