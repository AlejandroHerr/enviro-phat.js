import blessed from 'blessed';
import contrib from 'blessed-contrib';
import LineData, { LineDataInterface, LineInterface } from './LineData';

const MAX_SAMPLES = 600;

interface DashboardInterface {
  maxSamples: number;

  screen: blessed.Widgets.Screen;
  grid: any;

  lightData: LineDataInterface[];
  lightLine: LineInterface;

  pressureData: LineDataInterface;
  pressureLine: LineInterface;
  temperatureData: LineDataInterface;
  temperatureLine: LineInterface;

  render: () => void;

  setLightPoints: (xValue: string, values: { cValue: number; rValue: number; gValue: number; bValue: number }) => void;

  setPressurePoint: (xValue: string, yValue: number) => void;
  setTemperaturePoint: (xValue: string, yValue: number) => void;
}

export default ({ maxSamples = MAX_SAMPLES } = {}): DashboardInterface => {
  const screen = blessed.screen();

  const grid = new contrib.grid({ rows: 12, cols: 12, screen });

  const lightData = [
    LineData('Clear', maxSamples, { line: 'white' }),
    LineData('Red', maxSamples, { line: 'red' }),
    LineData('Green', maxSamples, { line: 'green' }),
    LineData('Blue', maxSamples, { line: 'blue' }),
  ];
  const lightLine: LineInterface = grid.set(0, 6, 6, 6, contrib.line, {
    label: 'Light',
    legend: { width: 8 },
    showLegend: true,
    showNthLabel: 5,
  });

  const pressureData = LineData('P', maxSamples, { line: 'red' });
  const pressureLine: LineInterface = grid.set(6, 0, 6, 6, contrib.line, {
    label: 'Pressure',
    legend: { width: 5 },
    showLegend: false,
    showNthLabel: 5,
  });

  const temperatureData = LineData('C', maxSamples, { line: 'red' });
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

    lightData,
    lightLine,

    pressureData,
    pressureLine,
    temperatureData,
    temperatureLine,

    render() {
      this.lightLine.setData(this.lightData.map(lineData => lineData.getData()));

      this.pressureLine.setData(this.pressureData.getData());
      this.temperatureLine.setData(this.temperatureData.getData());

      this.screen.render();
    },

    setLightPoints(
      xValue: string,
      { cValue, rValue, gValue, bValue }: { cValue: number; rValue: number; gValue: number; bValue: number },
    ) {
      this.lightData[0].pushPoint(xValue, cValue);
      this.lightData[1].pushPoint(xValue, rValue);
      this.lightData[2].pushPoint(xValue, gValue);
      this.lightData[3].pushPoint(xValue, bValue);
    },

    setPressurePoint(xValue: string, yValue: number) {
      this.pressureData.pushPoint(xValue, yValue);
    },
    setTemperaturePoint(xValue: string, yValue: number) {
      this.temperatureData.pushPoint(xValue, yValue);
    },
  };
};
