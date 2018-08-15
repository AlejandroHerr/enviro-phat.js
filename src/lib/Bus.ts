import { promisifyAll } from 'bluebird';
import { CompletionCallback, I2cBus, I2cBusFuncs, open } from 'i2c-bus';

/* tslint:disable-next-line:interface-name */
interface I2cBusPromised extends I2cBus {
  i2cFuncsAsync: () => Promise<I2cBusFuncs>;
  scanAsync: () => Promise<number[]>;

  i2cReadAsync: (address: number, length: number, buffer: Buffer) => Promise<number>;
  i2cWriteAsync: (address: number, length: number, buffer: Buffer) => Promise<number>;

  receiveByteAsync: (address: number) => Promise<number>;
  sendByteAsync: (address: number, byte: number) => Promise<void>;

  readByteAsync: (address: number, command: number) => Promise<number>;
  readWordAsync: (address: number, command: number) => Promise<number>;
  readI2cBlockAsync: (address: number, command: number, length: number, buffer: Buffer) => Promise<number>;

  writeByteAsync: (address: number, command: number, byte: number) => Promise<void>;
  writeWordAsync: (address: number, command: number, word: number) => Promise<void>;
  writeI2cBlockAsync: (address: number, command: number, length: number, buffer: Buffer) => Promise<number>;
}

export interface BusInterface {
  busNumber: number;
  i2cBus: I2cBusPromised | null;
  isOpen: boolean;
  openI2cBus: (busNumber: number, callback: CompletionCallback) => I2cBus;

  open: () => Promise<BusInterface>;

  i2cFuncs: () => Promise<I2cBusFuncs>;
  scan: () => Promise<number[]>;

  i2cRead: (address: number, length: number, buffer: Buffer) => Promise<number>;
  i2cWrite: (address: number, length: number, buffer: Buffer) => Promise<number>;

  receiveByte: (address: number) => Promise<number>;
  sendByte: (address: number, byte: number) => Promise<void>;

  readByte: (address: number, command: number) => Promise<number>;
  readI2cBlock: (address: number, command: number, length: number, buffer: Buffer) => Promise<number>;
  readWord: (address: number, command: number) => Promise<number>;

  writeByte: (address: number, command: number, byte: number) => Promise<void>;
  writeWord: (address: number, command: number, word: number) => Promise<void>;
  writeI2cBlock: (address: number, command: number, length: number, buffer: Buffer) => Promise<number>;
}

export default ({ busNumber = 1, openI2cBus = open } = {}): BusInterface => ({
  busNumber,
  i2cBus: null,
  isOpen: false,
  openI2cBus,

  open() {
    return new Promise((resolve, reject) => {
      this.i2cBus = promisifyAll<I2cBusPromised>(this.openI2cBus(this.busNumber, (error: Error) => {
        if (error) {
          reject(`Error opening i2c bus: ${error.message}`);
        }

        this.isOpen = true;
        resolve(this);
      }) as I2cBusPromised);
    });
  },

  i2cFuncs() {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.i2cFuncsAsync();
  },
  scan() {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.scanAsync();
  },

  i2cRead(address: number, length: number, buffer: Buffer) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.i2cReadAsync(address, length, buffer);
  },
  i2cWrite(address: number, length: number, buffer: Buffer) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.i2cWriteAsync(address, length, buffer);
  },

  receiveByte(address: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.receiveByteAsync(address);
  },
  sendByte(address: number, byte: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.sendByteAsync(address, byte);
  },

  readByte(address: number, command: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.readByteAsync(address, command);
  },
  readWord(address: number, command: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.readWordAsync(address, command);
  },
  readI2cBlock(address: number, command: number, length: number, buffer: Buffer) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.readI2cBlockAsync(address, command, length, buffer);
  },

  writeByte(address: number, command: number, byte: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.writeByteAsync(address, command, byte);
  },
  writeWord(address: number, command: number, word: number) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.writeWordAsync(address, command, word);
  },
  writeI2cBlock(address: number, command: number, length: number, buffer: Buffer) {
    if (!this.i2cBus || !this.isOpen) {
      throw new Error('Closed');
    }

    return this.i2cBus.writeI2cBlockAsync(address, command, length, buffer);
  },
});
