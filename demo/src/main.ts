import { BMP280, Bus, TCS3472 } from '../../build/main';

import Dashboard from './Dashboard';

const formatTime = (i: number) => {
  return i < 10 ? `0${i}` : `${i}`;
};

const getTime = () => {
  const today = new Date();
  const h = formatTime(today.getHours());
  const m = formatTime(today.getMinutes());
  const s = formatTime(today.getSeconds());

  return `${h}:${m}:${s}`;
};

const main = async () => {
  const bus = Bus({ busNumber: 1 });

  await bus.open();

  const bmp280 = BMP280({ i2cBus: bus });
  const tcs3472 = TCS3472({ i2cBus: bus });
  Promise.all([await bmp280.init(), await tcs3472.init()]);

  const dashboard = Dashboard({ maxSamples: 100 });

  setInterval(async () => {
    const [temperature, pressure, cValue, rValue, gValue, bValue] = await Promise.all([
      bmp280.readTemperature(),
      bmp280.readPressure(),
      tcs3472.readClearChannel(),
      tcs3472.readRedChannel(),
      tcs3472.readGreenChannel(),
      tcs3472.readBlueChannel(),
    ]);
    const time = getTime();

    dashboard.setLightPoints(time, {
      bValue,
      cValue,
      gValue,
      rValue,
    });
    dashboard.setPressurePoint(time, pressure / 1000);
    dashboard.setTemperaturePoint(time, temperature);

    dashboard.render();
  }, 500);
};

export default main;
