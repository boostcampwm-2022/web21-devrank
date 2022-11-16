import React from 'react';

export interface LanguageIconProps {
  language: string;
  width?: number;
  height?: number;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface LocaleProps {
  locale: string;
}

export type ButtonSize = 'sm' | 'md';

export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

export type ClickEvent = React.MouseEvent<HTMLElement>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type FormEvent = React.FormEvent<HTMLFormElement>;

export interface ButtonProps {
  /**
   * Button 내부 label 텍스트
   */
  label: string;
  /**
   * Button 크기 (sm => small, md => medium)
   */
  size?: ButtonSize;
  /**
   * Button 동작 여부
   */
  disabled?: boolean;
  /**
   * Button click시 실행되는 함수
   */
  onClick: (e: ButtonClickEvent) => void;
}

export interface StyledButtonProps {
  size?: ButtonSize;
}
