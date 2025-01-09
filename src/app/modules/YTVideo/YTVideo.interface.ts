export enum EType {
  "public",
  "private",
}

export type TYTVideo = {
  title: string;
  videoUrl: string;
  desc: string;
  type: "public" | "private";
};
