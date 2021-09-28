import { createTheme } from "@material-ui/core";
import { PRIMARYLIGHT, PRIMARYMAIN, SECONDARYDARK, SECONDARYMAIN } from "./colorConstant";

export const lightTheme = createTheme({
    palette:{
        primary:{
            main:PRIMARYMAIN,
            light:PRIMARYLIGHT,
        },
    }
})