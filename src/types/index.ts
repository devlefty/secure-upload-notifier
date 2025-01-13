export interface NotifierConfig {
  alert?: {
    position?: {
      top?: string;
      right?: string;
    };
    width?: {
      min?: string;
      max?: string;
    };
    animation?: {
      duration?: number;
      type?: string;
    };
    resetTimeout?: number;
  };
  ui?: {
    icon?: string;
    title?: string;
    message?: string;
    closeButton?: string;
  };
  style?: {
    colors?: {
      primary?: string;
      text?: string;
      close?: string;
      closeHover?: string;
    };
    borderRadius?: string;
    boxShadow?: string;
  };
  uploadSelectors?: string[];
}
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
