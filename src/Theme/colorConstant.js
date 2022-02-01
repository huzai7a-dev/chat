import { green, red } from "@material-ui/core/colors";
import light from '../theme.light.json';
import dark from '../theme.dark.json';

// light
export const PRIMARYMAIN = light.primary;
export const PRIMARYLIGHT = light.primary_light;
export const SECONDARYMAIN = light.secondary;
export const SECONDARYDARK = light.secondary_dark;
export const GREY = light.grey;
export const LIGHT = light.light;
export const WHITE = "#fff";
export const BLACK = light.black;
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
