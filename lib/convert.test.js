const convert = require('./convert');

test('convert 4 to 4', () => {
  expect(convert.convert(4, 4)).toBe(16);
});

test('convert 0 to 4', () => {
  expect(convert.convert(0, 4)).toBe(0);
});

test('toMoney converts float', () => {
  expect(convert.toMoney(5)).toBe('5.0000');
});

test('toMoney converts string', () => {
  expect(convert.toMoney("7")).toBe('7.0000');
});