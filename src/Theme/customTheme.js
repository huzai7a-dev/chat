import { createTheme } from "@material-ui/core";
import {
  PRIMARYLIGHT,
  PRIMARYMAIN,
  SECONDARYLIGHT,
  SECONDARYMAIN,
} from "./colorConstant";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: PRIMARYMAIN,
      light: PRIMARYLIGHT,
    },
    secondary: {
      main: SECONDARYMAIN,
      light: SECONDARYLIGHT,
    },
  },
});
