export const calculatePressure = (rawPressure: number, temperature: number, correction: number[]): number => {
  let var1 = temperature / 2.0 - 64000.0;
  let var2 = var1 * (var1 * (correction[5] / 32768.0) + correction[4] * 2);
  var2 = var2 / 4.0 + correction[3] * 65536.0;
  var1 = (correction[2] * var1 * (var1 / 524288.0) + correction[1] * var1) / 524288.0;
  var1 = (1.0 + var1 / 32768.0) * correction[0];

  if (var1 === 0) {
    return 0;
  }

  let var3 = 1048576.0 - rawPressure;
  var3 = (var3 - var2 / 4096.0) * (6250.0 / var1);
  var1 = correction[8] * ((var3 * var3) / 2147483648.0);
  var2 = (var3 * correction[7]) / 32768.0;

  return var3 + (var1 + var2 + correction[6]) / 16.0;
};

export const calculateTemperature = (rawTemperature: number, correction: number[]): number => {
  const var1 = (correction[1] * ((rawTemperature >>> 3) - (correction[0] << 1))) >>> 11;
  const var2 =
    (correction[2] >>> 14) * (((rawTemperature >>> 4) - correction[0] * (rawTemperature >>> (4 - 1))) >>> 12);

  return var1 + var2;
};
