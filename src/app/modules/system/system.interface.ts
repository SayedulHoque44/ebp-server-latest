/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Types } from "mongoose";
export const SystemCategory = [
  "Web_Sayed",
  "App_Tuhin_Android",
  "App_Tuhin_IOS",
  "App_Anik_Android",
  "App_Anik_IOS",
  "global",
] as const;
export const controlAction = [
  "idle",
  "active",
  "inactive",
  "completed",
] as const;

export type TSocialMedia = {
  name: string;
  url: string;
};
export type TPoster = {
  name: string;
  url: string;
  status: "Active" | "Inactive";
};
export type TAds = {
  name: string;
  url: string;
  status: "Active" | "Inactive";
};

// using systemInfo id we can get identify user using system , like use in the when using in the login/getme
export type TSystemInfo = {
  title: string; // title of the system
  description: string; // description of the system
  category:
    | "Web_Sayed"
    | "App_Tuhin_Android"
    | "App_Tuhin_IOS"
    | "App_Anik_Android"
    | "App_Anik_IOS"
    | "global"; // category of the system
  logo_name?: string; // logo name of the system
  logo_url?: string; // logo url of the system
  primary_color?: string; // primary color of the system
  secondary_color?: string; // secondary color of the system
  social_media?: TSocialMedia[]; // social media of the system
  redirect_url?: TSocialMedia[]; // redirect url of the system like if we want to redirect to any other url of any content
  posters: TPoster[]; // posters of the system
  ads: TAds[]; // posters of the system
};

//  ------------ controlls for Web ------------------

export type TControls = {
  systemId: Types.ObjectId; // system id
  title: string; // title of the controll
  type: string; // what type of controll it is
  Is_Control_Active: boolean; // if this true thats mean this controll is now active to run
  controlled_By_Time: boolean; // if this true that means this controll is controlled by time
  start_time?: Date; // from start time action will be active
  end_time?: Date; // till end time finish action will be active and after that it will be completed and forcefully we can also iactive it by using action inactve
  action: "idle" | "active" | "inactive" | "completed"; // idle = not started, active = started, inactive = stopped, completed = finished
};
