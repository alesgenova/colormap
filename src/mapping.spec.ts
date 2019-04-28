import { ColorNode, RGBColor, Scale, ColorMap } from './types';
import { findIndex, createColorMap, createColorMapFromColors, createColorMapFromColorNodes } from './mapping';
import { linearScale } from './scales';

expect.extend({
  toEachBeCloseTo(received: number[], expected: number[], digits: number = 2) {
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
});

const anyExpect = expect as any;

test('findIndex', () => {
  const colors: ColorNode[] = [ 
    {value: 0.0, color: [0, 0, 0]}, // index = 0
    {value: 0.1, color: [0, 0, 0]}, // index = 1
    {value: 0.2, color: [0, 0, 0]}, // index = 2
    {value: 0.3, color: [0, 0, 0]}, // index = 3
    {value: 0.4, color: [0, 0, 0]}, // index = 4
    {value: 0.5, color: [0, 0, 0]}, // index = 5
    {value: 0.6, color: [0, 0, 0]}, // index = 6
    {value: 0.7, color: [0, 0, 0]}, // index = 7
    {value: 0.8, color: [0, 0, 0]}, // index = 8
    {value: 0.9, color: [0, 0, 0]}, // index = 9
    {value: 1.0, color: [0, 0, 0]}  // index = 10
  ];

  let index: number;

  index = findIndex(colors, 0.0, 0, colors.length - 1);
  expect(index).toBe(0);

  index = findIndex(colors, 0.05, 0, colors.length - 1);
  expect(index).toBe(0);

  index = findIndex(colors, 0.88, 0, colors.length - 1);
  expect(index).toBe(8);

  index = findIndex(colors, 0.9, 0, colors.length - 1);
  expect(index).toBe(9);

  index = findIndex(colors, 1.0, 0, colors.length - 1);
  expect(index).toBe(10);

  index = findIndex(colors, 1.2, 0, colors.length - 1);
  expect(index).toBe(10);

  index = findIndex(colors, -0.2, 0, colors.length - 1);
  expect(index).toBe(0);
});

test('createColorMapFromColors', () => {
  let colors : RGBColor[];
  let scale: Scale;
  let colorMap: ColorMap;
  colors = [
    [0, 0, 0],
    [1, 1, 0]
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(25)).toEqual([0.25, 0.25, 0]);
  expect(colorMap(75)).toEqual([0.75, 0.75, 0]);
  expect(colorMap(100)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(200)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colors = [
    [0, 0, 0],
    [0.25, 0.25, 0],
    [1, 1, 0]
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(25)).toEqual([0.125, 0.125, 0]);
  expect(colorMap(50)).toEqual([0.25, 0.25, 0]);
  expect(colorMap(75)).toEqual([0.625, 0.625, 0]);
  expect(colorMap(100)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(200)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colorMap = createColorMapFromColors([], scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(100)).toEqual([0, 0, 0]);
});

test('createColorMapFromColorNodes', () => {
  let colors : ColorNode[];
  let scale: Scale;
  let colorMap: ColorMap;
  colors = [
    {value: 0.0, color: [0, 0, 0]},
    {value: 0.25, color: [0.25, 0.25, 0]},
    {value: 1.0, color: [0, 1, 1]}
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(12.5)).toEqual([0.125, 0.125, 0]);
  expect(colorMap(25)).toEqual([0.25, 0.25, 0]);
  anyExpect(colorMap(50)).toEachBeCloseTo([0.16666, 0.5, 0.33333], 5);
  anyExpect(colorMap(75)).toEachBeCloseTo([0.08333, 0.75, 0.66666], 5);
  expect(colorMap(100)).toEqual([0.0, 1.0, 1.0]);
  expect(colorMap(200)).toEqual([0.0, 1.0, 1.0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colorMap = createColorMapFromColorNodes([], scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(100)).toEqual([0, 0, 0]);
});
