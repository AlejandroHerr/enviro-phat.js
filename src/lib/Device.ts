import { BusInterface } from './Bus';

export interface DeviceInterface {
  address: number;
  i2cBus: BusInterface;

  i2cRead: (length: number, buffer: Buffer) => Promise<number>;
  i2cWrite: (length: number, buffer: Buffer) => Promise<number>;

  receiveByte: () => Promise<number>;
  sendByte: (byte: number) => Promise<void>;

  readByte: (command: number) => Promise<number>;
  readI2cBlock: (command: number, length: number, buffer: Buffer) => Promise<number>;
  readWord: (command: number) => Promise<number>;

  writeByte: (command: number, byte: number) => Promise<void>;
  writeWord: (command: number, word: number) => Promise<void>;
  writeI2cBlock: (command: number, length: number, buffer: Buffer) => Promise<number>;
}

export default ({ address, i2cBus }: { address: number; i2cBus: BusInterface }): DeviceInterface => ({
  address,
  i2cBus,

  i2cRead(length: number, buffer: Buffer) {
    return this.i2cBus.i2cRead(this.address, length, buffer);
  },
  i2cWrite(length: number, buffer: Buffer) {
    return this.i2cBus.i2cWrite(this.address, length, buffer);
  },

  receiveByte() {
    return this.i2cBus.receiveByte(this.address);
  },
  sendByte(byte: number) {
    return this.i2cBus.sendByte(this.address, byte);
  },

  readByte(command: number) {
    return this.i2cBus.readByte(this.address, command);
  },
  readWord(command: number) {
    return this.i2cBus.readWord(this.address, command);
  },
  readI2cBlock(command: number, length: number, buffer: Buffer) {
    return this.i2cBus.readI2cBlock(this.address, command, length, buffer);
  },

  writeByte(command: number, byte: number) {
    return this.i2cBus.writeByte(this.address, command, byte);
  },
  writeWord(command: number, word: number) {
    return this.i2cBus.writeWord(this.address, command, word);
  },
  writeI2cBlock(command: number, length: number, buffer: Buffer) {
    return this.i2cBus.writeI2cBlock(this.address, command, length, buffer);
  },
});
