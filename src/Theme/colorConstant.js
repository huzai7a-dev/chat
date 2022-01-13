import { green, red } from "@material-ui/core/colors";

// light
export const PRIMARYMAIN = "#267396";
export const PRIMARYLIGHT = "#d8ecf7";
export const SECONDARYMAIN = "#f1f1f4";
export const SECONDARYDARK = "#d5d9de";
export const WHITE = "#fff";
// dark
export const DARKMAIN = "#161616";
export const DARKLIGHT = "rgb(55 71 79 / 41%)";
export const DARKPRIMFONT = "#fff";
export const DARKSECFONT = "#cfd8dc";
export const AUTHCOLOR = "#feb318";
// actions
export const DANGER = red[400];
export const DANGERLIGHT = red[50];
export const SUCCESS = green[400];
export const SUCCESSLIGHT = green[50];

export const BACKGROUND = {
  ["light"]: {
    default: SECONDARYMAIN,
    active: WHITE,
  },
  ["dark"]: {
    default: DARKMAIN,
    active: DARKLIGHT,
  },
};
