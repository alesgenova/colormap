import { findIndex, linearMixer, floorMixer, ceilMixer, roundMixer } from './common';
import { FunctionNode, Vec2 } from './types';

export function toEachBeCloseTo(received: number[], expected: number[], digits: number = 2) {
  if (received.length !== expected.length) {
    return {
      pass: false,
      message: () => `expected ${received} to have the same size as ${expected}`
    }
  }

  const isCloseTo = (a: number, b: number, threshold: number) : boolean => {
    return Math.abs(a - b) < threshold;
  }

  const threshold = 1 / (Math.pow(10, digits));
  for (let i = 0; i < received.length; ++i) {
    if (!isCloseTo(received[i], expected[i], threshold)) {
      return {
        pass: false,
        message: () => `expected each element of ${JSON.stringify(received)} to be close to the elements of ${JSON.stringify(expected)}`
      }
    }
  }
  return {
    pass: true,
    message: () => `expected not each element of ${JSON.stringify(received)} to be close to the elements of ${JSON.stringify(expected)}`
  }
}

expect.extend({
  toEachBeCloseTo
})
const anyExpect = expect as any;

test('findIndex', () => {
  const nodes: FunctionNode[] = [ 
    {value: 0.0}, // index = 0
    {value: 0.1}, // index = 1
    {value: 0.2}, // index = 2
    {value: 0.3}, // index = 3
    {value: 0.4}, // index = 4
    {value: 0.5}, // index = 5
    {value: 0.6}, // index = 6
    {value: 0.7}, // index = 7
    {value: 0.8}, // index = 8
    {value: 0.9}, // index = 9
    {value: 1.0}  // index = 10
  ];

  let index: number;

  index = findIndex(nodes, 0.0, 0, nodes.length - 1);
  expect(index).toBe(0);

  index = findIndex(nodes, 0.05, 0, nodes.length - 1);
  expect(index).toBe(0);

  index = findIndex(nodes, 0.88, 0, nodes.length - 1);
  expect(index).toBe(8);

  index = findIndex(nodes, 0.9, 0, nodes.length - 1);
  expect(index).toBe(9);

  index = findIndex(nodes, 1.0, 0, nodes.length - 1);
  expect(index).toBe(10);

  index = findIndex(nodes, 1.2, 0, nodes.length - 1);
  expect(index).toBe(10);

  index = findIndex(nodes, -0.2, 0, nodes.length - 1);
  expect(index).toBe(0);
});


test('linearMixer', () => {
  const precision = 6;
  let coefficients: Vec2;

  coefficients = linearMixer(0.6, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = linearMixer(0.625, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0.75, 0.25], precision);

  coefficients = linearMixer(0.65, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0.5, 0.5], precision);

  coefficients = linearMixer(0.675, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0.25, 0.75], precision);
});

test('floorMixer', () => {
  const precision = 6;
  let coefficients: Vec2;

  coefficients = floorMixer(0.6, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = floorMixer(0.625, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = floorMixer(0.65, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = floorMixer(0.675, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);
});

test('ceilMixer', () => {
  const precision = 6;
  let coefficients: Vec2;

  coefficients = ceilMixer(0.6, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);

  coefficients = ceilMixer(0.625, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);

  coefficients = ceilMixer(0.65, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);

  coefficients = ceilMixer(0.675, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);
});

test('roundMixer', () => {
  const precision = 6;
  let coefficients: Vec2;

  coefficients = roundMixer(0.6, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = roundMixer(0.625, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([1, 0], precision);

  coefficients = roundMixer(0.651, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);

  coefficients = roundMixer(0.675, 0.6, 0.7);
  anyExpect(coefficients).toEachBeCloseTo([0, 1], precision);
});
