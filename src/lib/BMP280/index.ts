import { BusInterface } from '../Bus';
import Device, { DeviceInterface } from '../Device';

import sleep from '../helpers/sleep';

import { ID, REGISTERS, RESET_RESET } from './constants';
import { calculatePressure, calculateTemperature } from './helpers';
import { PROFILE_PIMORONI } from './profiles';

interface BMP280Interface extends DeviceInterface {
  address: number;
  i2cBus: BusInterface;

  temperatureCorrection: number[];
  pressureCorrection: number[];

  init: (config?: number, ctrlMeas?: number) => Promise<BMP280Interface>;

  reset: () => Promise<BMP280Interface>;

  readConfig: () => Promise<number>;
  writeConfig: (byte: number) => Promise<BMP280Interface>;
  readControlMeasurement: () => Promise<number>;
  writeControlMeasurement: (byte: number) => Promise<BMP280Interface>;

  readTemperatureCorrection: () => Promise<BMP280Interface>;
  readPressureCorrection: () => Promise<BMP280Interface>;

  readMagnitude: (this: BMP280Interface, magnitudeRegister: number) => Promise<number>;
  readPressure: () => Promise<number>;
  readTemperature: () => Promise<number>;
}

export default ({ address = 0x77, i2cBus }: { address?: number; i2cBus: BusInterface }): BMP280Interface => {
  const device = Device({ address, i2cBus });

  return {
    ...device,

    pressureCorrection: [],
    temperatureCorrection: [],

    async init(
      this: BMP280Interface,
      config: number = PROFILE_PIMORONI.config,
      ctrlMeas: number = PROFILE_PIMORONI.ctrlMeas,
    ) {
      const id = await this.readByte(REGISTERS.ID);

      if (id !== ID) {
        throw new Error('The device is not a BMP280');
      }

      await this.reset();
      await sleep(200);

      await this.writeControlMeasurement(ctrlMeas);
      await sleep(200);

      await this.writeConfig(config);
      await sleep(200);

      await Promise.all([this.readTemperatureCorrection(), this.readPressureCorrection()]);
      await sleep(200);

      return this;
    },

    async reset(this: BMP280Interface) {
      await this.writeByte(REGISTERS.RESET, RESET_RESET);

      return this;
    },

    readConfig(this: BMP280Interface) {
      return this.readByte(REGISTERS.CONFIG);
    },
    async writeConfig(this: BMP280Interface, byte: number) {
      await this.writeByte(REGISTERS.CONFIG, byte);

      return this;
    },
    readControlMeasurement(this: BMP280Interface): Promise<number> {
      return this.readByte(REGISTERS.CTRL_MEAS);
    },
    async writeControlMeasurement(this: BMP280Interface, byte: number): Promise<BMP280Interface> {
      await this.writeByte(REGISTERS.CTRL_MEAS, byte);

      return this;
    },

    async readTemperatureCorrection(this: BMP280Interface) {
      const buffer = Buffer.alloc(6);

      await this.readI2cBlock(REGISTERS.TEMP_CORRECTION, 6, buffer);

      this.temperatureCorrection[0] = buffer.readUInt16LE(0);
      this.temperatureCorrection[1] = buffer.readInt16LE(2);
      this.temperatureCorrection[2] = buffer.readInt16LE(4);

      return this;
    },
    async readPressureCorrection(this: BMP280Interface) {
      const buffer = Buffer.alloc(18);

      await this.readI2cBlock(REGISTERS.PRESS_CORRECTION, 18, buffer);

      this.pressureCorrection[0] = buffer.readUInt16LE(0);
      this.pressureCorrection[1] = buffer.readInt16LE(2);
      this.pressureCorrection[2] = buffer.readInt16LE(4);
      this.pressureCorrection[3] = buffer.readInt16LE(6);
      this.pressureCorrection[4] = buffer.readInt16LE(8);
      this.pressureCorrection[5] = buffer.readInt16LE(10);
      this.pressureCorrection[6] = buffer.readInt16LE(12);
      this.pressureCorrection[7] = buffer.readInt16LE(14);
      this.pressureCorrection[8] = buffer.readInt16LE(16);

      return this;
    },

    async readMagnitude(this: BMP280Interface, magnitudeRegister: number) {
      const buffer = Buffer.alloc(3);

      await this.readI2cBlock(magnitudeRegister, 3, buffer);

      return buffer.readUIntBE(0, 3) >>> 4;
    },
    async readPressure(this: BMP280Interface) {
      const rawTemperature = await this.readMagnitude(REGISTERS.TEMP);
      const rawPressure = await this.readMagnitude(REGISTERS.PRESS);

      const temperature = calculateTemperature(rawTemperature, this.temperatureCorrection);

      return calculatePressure(rawPressure, temperature, this.pressureCorrection);
    },
    async readTemperature(this: BMP280Interface) {
      const rawTemperature = await this.readMagnitude(REGISTERS.TEMP);

      const temperature = calculateTemperature(rawTemperature, this.temperatureCorrection);

      return temperature / 5120;
    },
  };
};
