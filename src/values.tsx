import { Setting } from "./types";

export const SETTINGS_LIMITS = {
    [Setting.BLUR]:
    {
        MAX: 3,
        MIN: 0,
        DEFAULT: 0
    },
    [Setting.CONTRAST]:
    {
        MAX: 12,
        MIN: -12,
        DEFAULT: 0
    },
    [Setting.BALANCE]:
    {
        MAX: 6,
        MIN: 0,
        DEFAULT: 0
    },
    [Setting.SHARPEN]:
    {
        MAX: 1,
        MIN: 0,
        DEFAULT: 0
    }
};

export const DEFAULT_SETTINGS = {
    [Setting.BLUR]: SETTINGS_LIMITS[Setting.BLUR].DEFAULT,
    [Setting.CONTRAST]: SETTINGS_LIMITS[Setting.CONTRAST].DEFAULT,
    [Setting.BALANCE]: SETTINGS_LIMITS[Setting.BALANCE].DEFAULT,
    [Setting.SHARPEN]: SETTINGS_LIMITS[Setting.SHARPEN].DEFAULT
};
