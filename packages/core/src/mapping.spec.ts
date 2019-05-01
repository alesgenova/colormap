import { ColorNode, RGBColor, Scale, ColorMap, OpacityMap, OpacityNode, Mixer } from './types';
import { createColorMap, createOpacityMap, createColorOpacityMap } from './mapping';
import { linearScale } from './scales';
import { toEachBeCloseTo } from './common.spec';
import { linearMixer } from './common';

expect.extend({
  toEachBeCloseTo
});

const anyExpect = expect as any;

test('createNoColorMap', () => {
  const scale = linearScale([0, 100], [0, 1]);
  const colorMap = createColorMap([], scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(100)).toEqual([0, 0, 0]);
});

test('createColorMapFromArray', () => {
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
});

test('createColorMapFromNodes', () => {
  let colors : ColorNode[];
  let scale: Scale;
  let colorMap: ColorMap;
  colors = [
    {value: 0.0, mapped: [0, 0, 0]},
    {value: 0.25, mapped: [0.25, 0.25, 0]},
    {value: 1.0, mapped: [0, 1, 1]}
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
});

test('createNoOpacityMap', () => {
  const precision = 6;
  const scale = linearScale([0, 100], [0, 1]);
  const opacityMap = createOpacityMap([], scale);
  expect(opacityMap(0)).toBeCloseTo(1, precision);
  expect(opacityMap(100)).toBeCloseTo(1, precision);
});

test('createOpacityMapFromArray', () => {
  const precision = 6;
  let opacities : number[];
  let scale: Scale;
  let opacityMap: OpacityMap;
  opacities = [0, 1];
  scale = linearScale([0, 100], [0, 1]);
  opacityMap = createOpacityMap(opacities, scale);
  expect(opacityMap(0)).toBeCloseTo(0, precision);
  expect(opacityMap(25)).toBeCloseTo(0.25, precision);
  expect(opacityMap(75)).toBeCloseTo(0.75, precision);
  expect(opacityMap(100)).toBeCloseTo(1, precision);
  expect(opacityMap(200)).toBeCloseTo(1, precision);
  expect(opacityMap(-100)).toBeCloseTo(0, precision);

  opacities = [0, 0.25, 1];
  scale = linearScale([0, 100], [0, 1]);
  opacityMap = createOpacityMap(opacities, scale);
  expect(opacityMap(0)).toBeCloseTo(0, precision);
  expect(opacityMap(25)).toBeCloseTo(0.125, precision);
  expect(opacityMap(50)).toBeCloseTo(0.25, precision);
  expect(opacityMap(75)).toBeCloseTo(0.625, precision);
  expect(opacityMap(100)).toBeCloseTo(1, precision);
  expect(opacityMap(200)).toBeCloseTo(1, precision);
  expect(opacityMap(-100)).toBeCloseTo(0, precision);
});

test('createOpacityMapFromNodes', () => {
  const precision = 6;
  let opacities : OpacityNode[];
  let scale: Scale;
  let opacityMap: OpacityMap;
  let mixer: Mixer;
  opacities = [
    {value: 0.25, mapped: 0.25},
    {value: 1.0, mapped: 0},
    {value: 0.0, mapped: 0}
  ];
  scale = linearScale([0, 100], [0, 1]);
  mixer = linearMixer;
  opacityMap = createOpacityMap(opacities, scale, mixer);
  expect(opacityMap(0)).toBeCloseTo(0, precision);
  expect(opacityMap(12.5)).toBeCloseTo(0.125, precision);
  expect(opacityMap(25)).toBeCloseTo(0.25, precision);
  expect(opacityMap(50)).toBeCloseTo(0.1666666, precision);
  expect(opacityMap(75)).toBeCloseTo(0.0833333, precision);
  expect(opacityMap(100)).toBeCloseTo(0, precision);
  expect(opacityMap(200)).toBeCloseTo(0, precision);
  expect(opacityMap(-100)).toBeCloseTo(0, precision);
});

test('createNoColorOpacityMap', () => {
  const scale = linearScale([0, 100], [0, 1]);
  const colorMap = createColorMap([], scale);
  const opacityMap = createOpacityMap([], scale);
  const colorOpacityMap = createColorOpacityMap(colorMap, opacityMap);
  anyExpect(colorOpacityMap(0)).toEachBeCloseTo([0, 0, 0, 1]);
  anyExpect(colorOpacityMap(100)).toEachBeCloseTo([0, 0, 0, 1]);
});
