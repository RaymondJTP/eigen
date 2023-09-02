const dayjs = require('dayjs');

function convertToUtc(date) {
  return dayjs(date).subtract(7, 'hour').toISOString();
}

function convertToLocal(date) {
  return dayjs(date).add(7, 'hour').toISOString();
}

module.exports = {
  convertToUtc,
  convertToLocal,
};
