import blessed from 'blessed';
import contrib from 'blessed-contrib';
import LineData, { LineDataInterface, LineInterface } from './LineData';

const MAX_SAMPLES = 600;

interface DashboardInterface {
  maxSamples: number;

  screen: blessed.Widgets.Screen;
  grid: any;

  pressureData: LineDataInterface;
  pressureLine: LineInterface;
  temperatureData: LineDataInterface;
  temperatureLine: LineInterface;

  render: () => void;

  setPressurePoint: (xValue: string, yValue: number) => void;
  setTemperaturePoint: (xValue: string, yValue: number) => void;
}

export default ({ maxSamples = MAX_SAMPLES } = {}): DashboardInterface => {
  const screen = blessed.screen();

  const grid = new contrib.grid({ rows: 12, cols: 12, screen });

  const pressureData = LineData('P', { line: 'red' });
  const pressureLine: LineInterface = grid.set(6, 0, 6, 6, contrib.line, {
    label: 'Pressure',
    legend: { width: 5 },
    showLegend: false,
    showNthLabel: 5,
  });

  const temperatureData = LineData('C', { line: 'red' });
  const temperatureLine: LineInterface = grid.set(0, 0, 6, 6, contrib.line, {
    label: 'Temperature',
    legend: { width: 5 },
    maxY: 40,
    showLegend: false,
    showNthLabel: 5,
  });

  return {
    maxSamples,

    grid,
    screen,

    pressureData,
    pressureLine,
    temperatureData,
    temperatureLine,

    render(this: DashboardInterface) {
      this.screen.render();
    },
    setPressurePoint(this: DashboardInterface, xValue: string, yValue: number) {
      const { x, y } = this.pressureData;

      const newX = x.length <= this.maxSamples ? x.concat(xValue) : x.slice(1).concat(xValue);
      const newY = y.length <= this.maxSamples ? y.concat(yValue) : y.slice(1).concat(yValue);

      this.pressureData = {
        ...this.pressureData,
        x: newX,
        y: newY,
      };
      this.pressureLine.setData(this.pressureData);
    },
    setTemperaturePoint(this: DashboardInterface, xValue: string, yValue: number) {
      const { x, y } = this.temperatureData;

      const newX = x.length <= this.maxSamples ? x.concat(xValue) : x.slice(1).concat(xValue);
      const newY = y.length <= this.maxSamples ? y.concat(yValue) : y.slice(1).concat(yValue);

      this.temperatureData = {
        ...this.temperatureData,
        x: newX,
        y: newY,
      };

      this.temperatureLine.setData([this.temperatureData]);
    },
  };
};
