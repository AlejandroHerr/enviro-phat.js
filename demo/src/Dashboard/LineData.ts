export interface LineDataInterface {
  title: string;
  style: object;
  x: Array<number | string>;
  y: Array<number | string>;
}

export interface LineInterface {
  setData: (LineData) => void;
}

export default (title, style = { line: 'red' }): LineDataInterface => ({
  style,
  title,
  x: [],
  y: [],
});
