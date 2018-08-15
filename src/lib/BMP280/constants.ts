/* tslint:disable:object-literal-sort-keys */
export const ID = 0x58;

export const REGISTERS = {
  TEMP_XLSB: 0xfc,
  TEMP_LSB: 0xfb,
  TEMP_MSB: 0xfa,
  TEMP: 0xfa,
  PRESS_XLSB: 0xf9,
  PRESS_LSB: 0xf8,
  PRESS_MSB: 0xf7,
  PRESS: 0xf7,
  CONFIG: 0xf5,
  CTRL_MEAS: 0xf4,
  STATUS: 0xf3,
  RESET: 0xe0,
  ID: 0xd0,
  TEMP_CORRECTION: 0x88,
  PRESS_CORRECTION: 0x8e,
};

export const RESET_RESET = 0xb6;

export const STATUS_MASKS = {
  IM_UPDATE: 0b00000001,
  MEASURING: 0b00001000,
};

export const CTRL_MEAS_TEMP_SAMPLING = {
  x0: 0b00000000,
  x1: 0b00100000,
  x2: 0b01000000,
  x4: 0b01100000,
  x8: 0b10000000,
  x16: 0b10100000,
};

export const CTRL_MEAS_PRESS_SAMPLING = {
  x0: 0b00000000,
  x1: 0b00000100,
  x2: 0b00001000,
  x4: 0b00001100,
  x8: 0b00010000,
  x16: 0b00010100,
};

export const CTRL_MEAS_MODE = {
  SLEEP: 0b00000000,
  FORCED: 0b00000001,
  NORMAL: 0b00000011,
};

export const CONFIG_STANDBY = {
  u5: 0b00000000,
  m62: 0b00100000,
  m125: 0b01000000,
  m25: 0b01100000,
  m5: 0b10000000,
  s1: 0b10100000,
  s2: 0b11000000,
  s4: 0b11100000,
};

export const CONFIG_FILTER = {
  x0: 0b00000000,
  x2: 0b00000100,
  x4: 0b00001000,
  x8: 0b00001100,
  x16: 0b00010000,
  x32: 0b00010100,
  x64: 0b00011000,
  x128: 0b00011100,
};
