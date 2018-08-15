/* tslint:disable:object-literal-sort-keys */
export const COMMAND_REGISTER_CMD = 0x80;

export const COMMAND_REGISTER_TYPE = {
  REPEATED: 0x00,
  AUTO_INCREMENT: 0x20,
  SPECIAL_FUNCTION: 0x60,
};

export const COMMAND_REGISTER_SF = {
  CLEAR_CHANNEL: 0x06,
};

export const REGISTERS = {
  ENABLE: 0x00,
  ATIME: 0x01,
  WTIME: 0x03,
  AILTL: 0x04,
  AILTH: 0x05,
  AIHTL: 0x06,
  AIHTH: 0x07,
  PERS: 0x0c,
  CONFIG: 0x0d,
  CONTROL: 0x0f,
  ID: 0x12,
  STATUS: 0x13,
  CDATAL: 0x14,
  CDATAH: 0x15,
  RDATAL: 0x16,
  RDATAH: 0x17,
  GDATAL: 0x18,
  GDATAH: 0x19,
  BDATAL: 0x1a,
  BDATAH: 0x1b,
};

export const ENABLE_WAIT = 0x08;
export const ENABLE_RGBC = 0x02;
export const ENABLE_POWER = 0x01;

export const STATUS_AINT_MASK = 0x10;
