/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-bitwise */
import {
  CONFIG_FILTER,
  CONFIG_STANDBY,
  CTRL_MEAS_MODE,
  CTRL_MEAS_PRESS_SAMPLING,
  CTRL_MEAS_TEMP_SAMPLING,
} from './constants';

export const PROFILE_PIMORONI = {
  ctrlMeas: CTRL_MEAS_TEMP_SAMPLING.x16 | CTRL_MEAS_PRESS_SAMPLING.x16 | CTRL_MEAS_MODE.NORMAL,
  config: CONFIG_STANDBY.m5 | CONFIG_FILTER.x16,
};
