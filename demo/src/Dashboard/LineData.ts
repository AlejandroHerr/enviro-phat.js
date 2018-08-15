interface LineDataDescriptorInterface {
  title: string;
  style: object;
  x: string[];
  y: number[];
}
export interface LineDataInterface extends LineDataDescriptorInterface {
  maxSamples: number;

  getData: () => LineDataDescriptorInterface;
  pushPoint: (xValue: string, yValue: number) => LineDataInterface;
}

export interface LineInterface {
  setData: (data: LineDataDescriptorInterface | LineDataDescriptorInterface[]) => void;
}

export default (title: string, maxSamples: number, style = { line: 'red' }): LineDataInterface => ({
  style,
  title,
  x: [],
  y: [],

  maxSamples,

  getData() {
    return {
      style: this.style,
      title: this.title,
      x: this.x,
      y: this.y,
    };
  },
  pushPoint(xValue: string, yValue: number) {
    this.x = this.x.length <= this.maxSamples ? this.x.concat(xValue) : this.x.slice(1).concat(xValue);
    this.y = this.y.length <= this.maxSamples ? this.y.concat(yValue) : this.y.slice(1).concat(yValue);

    return this;
  },
});
