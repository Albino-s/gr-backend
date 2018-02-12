import R, {compose as o} from 'ramda';
import moment from 'moment';
import {fromUnixTime} from './query';

export const dateTimeFrmt = date => moment(date).format('YYYY-MM-DD HH:mm:ss');
export const dateFrmt = date => moment(date).format('YYYY-MM-DD');

export const csvDateFrmt = 'YYYY-MM-DD';
export const csvTimeFrmt = 'HH:mm:ss';

export const unixTime = o(fromUnixTime, R.divide(R.__, 1e3), parseInt);

export const dateRange = R.uncurryN(2, f => o(
  R.apply(f),
  R.map(unixTime),
  R.split('..')
));

export const datesWithOutTimeRange = R.uncurryN(2, f => o(
  R.apply(f),
  R.split('..')
));

dateRange.format = /^\d+\.\.\d+$/;
dateRange.dateFormat = /^\d{4}\-\d{2}\-\d{2}\.\.\d{4}\-\d{2}\-\d{2}$/;

export const list = value => {
  if (typeof value === 'string') {
    return R.split(',', value);
  }
  if (R.is(Array, value)) {
    return value;
  }
  return Array.of(value);
};
