import { ISupportApp } from '~types/app';

export interface IProfile {
  _id: string;
  email: string;
  registered: number | null;
  updated: number | null;
  supportApp: ISupportApp;
}

export interface IUpdateAppInfo {
  version: string;
  googlePlayUrl: string;
}

export interface IError {
  [x: string]: string;
}
