import { BusInterface } from '../Bus';
import Device, { DeviceInterface } from '../Device';

// import sleep from '../helpers/sleep';
import {
  COMMAND_REGISTER_CMD,
  COMMAND_REGISTER_SF,
  COMMAND_REGISTER_TYPE,
  ENABLE_POWER,
  ENABLE_RGBC,
  REGISTERS,
  STATUS_AINT_MASK,
} from './constants';

type ReadChannelFn = () => Promise<number>;

interface TCS3472Interface extends DeviceInterface {
  // init: (config?: number, ctrlMeas?: number) => Promise<TCS3472Interface>;
  aTime: number;
  maxCount: number;

  readRegister: (register: number) => Promise<number>;
  readWordRegister: (register: number) => Promise<number>;
  writeRegister: (register: number, byte: number) => Promise<TCS3472Interface>;
  writeWordRegister: (register: number, word: number) => Promise<TCS3472Interface>;

  init: (integrationTime?: number) => Promise<TCS3472Interface>;

  readIntegrationTime: () => Promise<TCS3472Interface>;
  writeIntegrationTime: (time: number) => Promise<TCS3472Interface>;

  readClearChannel: ReadChannelFn;
  readRedChannel: ReadChannelFn;
  readGreenChannel: ReadChannelFn;
  readBlueChannel: ReadChannelFn;

  setLowThreshold: (threshold: number) => Promise<TCS3472Interface>;
  setHighThreshold: (threshold: number) => Promise<TCS3472Interface>;
  clearInterruption: () => Promise<TCS3472Interface>;
  readInterruption: () => Promise<boolean>;
}

export default ({ address = 0x29, i2cBus }: { address?: number; i2cBus: BusInterface }): TCS3472Interface => {
  const device = Device({ address, i2cBus });

  return {
    ...device,

    aTime: 0,
    maxCount: 0,

    readRegister(register: number): Promise<number> {
      return this.readByte(COMMAND_REGISTER_CMD | register);
    },
    readWordRegister(register: number): Promise<number> {
      return this.readWord(COMMAND_REGISTER_CMD | register);
    },
    async writeRegister(register: number, byte: number): Promise<TCS3472Interface> {
      await this.writeByte(COMMAND_REGISTER_CMD | register, byte);

      return this;
    },
    async writeWordRegister(register: number, word: number): Promise<TCS3472Interface> {
      await this.writeWord(COMMAND_REGISTER_CMD | register, word);

      return this;
    },

    async init(integrationTime: number = 511.2) {
      await this.writeRegister(REGISTERS.ENABLE, ENABLE_RGBC | ENABLE_POWER);

      await this.writeIntegrationTime(integrationTime);
      await this.readIntegrationTime();

      return this;
    },

    async readIntegrationTime() {
      const integrationTime = await this.readRegister(REGISTERS.ATIME);

      this.aTime = 256 - integrationTime;
      this.maxCount = Math.min(65535, (256 - this.aTime) * 1024);

      return this;
    },
    async writeIntegrationTime(time: number) {
      if (time < 2.4 || time > 612) {
        throw new Error('Integration time must be between 2.4 and 612ms');
      }

      this.aTime = Math.round(time / 2.4);
      this.maxCount = Math.min(65535, (256 - this.aTime) * 1024);

      await this.writeRegister(REGISTERS.ATIME, 256 - this.aTime);

      return this;
    },

    async setLowThreshold(threshold: number) {
      const cmd = COMMAND_REGISTER_CMD | COMMAND_REGISTER_TYPE.AUTO_INCREMENT | REGISTERS.AILTL;

      await this.writeWord(cmd, threshold);

      return this;
    },
    async setHighThreshold(threshold: number) {
      const cmd = COMMAND_REGISTER_CMD | COMMAND_REGISTER_TYPE.AUTO_INCREMENT | REGISTERS.AIHTL;

      await this.writeWord(cmd, threshold);

      return this;
    },
    async clearInterruption() {
      const command = COMMAND_REGISTER_CMD | COMMAND_REGISTER_TYPE.SPECIAL_FUNCTION | COMMAND_REGISTER_SF.CLEAR_CHANNEL;

      await this.sendByte(command);

      return this;
    },
    async readInterruption() {
      const status = await this.readRegister(REGISTERS.STATUS);

      return (status | (STATUS_AINT_MASK ^ 0xff)) === 0xff;
    },

    async readClearChannel() {
      return this.readWordRegister(REGISTERS.CDATAL);
    },
    async readRedChannel() {
      return this.readWordRegister(REGISTERS.RDATAL);
    },
    async readGreenChannel() {
      return this.readWordRegister(REGISTERS.GDATAL);
    },
    async readBlueChannel() {
      return this.readWordRegister(REGISTERS.BDATAL);
    },
  };
};
