export enum Setting {
  BLUR = "blur",
  CONTRAST = "contrast",
  BALANCE = "balance",
  SHARPEN = "sharpen"
};

export interface Settings {
  "blur": number;
  "contrast": number;
  "balance": number;
  "sharpen": number;
};

export interface ColourIn {
  "colour_in": string;
  "image": string;
  "settings": Settings;
  "height": number;
  "width": number;
};
