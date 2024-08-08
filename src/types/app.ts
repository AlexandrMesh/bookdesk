export type IData = {
  name: string;
  version: string;
  description: string;
  email: string;
};

export interface ISupportApp {
  confirmed: boolean;
  viewedAt: number | null;
}
