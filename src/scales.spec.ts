import { linearScale } from './scales';
import { Range } from './types';

test('linearScale', () => {
  const domain : Range = [-100, 200];
  const range : Range = [0, 2];
  let scale = linearScale(domain, range);
  const nDigits = 6;
  expect(scale(0)).toBeCloseTo(2/3, nDigits);
  expect(scale(-100)).toBeCloseTo(0, nDigits);
  expect(scale(200)).toBeCloseTo(2, nDigits);
  expect(scale(-200)).toBeCloseTo(-2/3, nDigits);
  expect(scale(500)).toBeCloseTo(4, nDigits);

  scale = linearScale([0, 0], range);
  expect(scale(0)).toBeCloseTo(0, nDigits);
});
