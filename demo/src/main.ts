import { BMP280, Bus } from '../../build/main';

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

  await bmp280.init();

  const dashboard = Dashboard();

  setInterval(async () => {
    const [temperature, pressure] = await Promise.all([bmp280.readTemperature(), bmp280.readPressure()]);
    const time = getTime();

    dashboard.setPressurePoint(time, pressure / 1000);
    dashboard.setTemperaturePoint(time, temperature);

    dashboard.render();
  }, 1000);
};

export default main;
