import { toUint8, toHex, uint8Map, hexMap } from './utils';
import { RGBAColor, RGBColor } from './types';
import { createOpacityMap, createColorMap } from './mapping';
import { linearScale } from './scales';

test('toUint8', () => {
  expect(toUint8(0)).toEqual(0);
  expect(toUint8([0, 0, 0])).toEqual([0, 0, 0]);
  expect(toUint8([0, 0, 0, 0])).toEqual([0, 0, 0, 0]);

  expect(toUint8(1)).toEqual(255);
  expect(toUint8([1, 1, 1])).toEqual([255, 255, 255]);
  expect(toUint8([1, 1, 1, 1])).toEqual([255, 255, 255, 255]);

  expect(toUint8(-0.5)).toEqual(0);
  expect(toUint8(1.5)).toEqual(255);
  expect(toUint8(0.25)).toEqual(64);
});

test('toHex', () => {
  expect(toHex(0)).toEqual('00');
  expect(toHex([0, 0, 0])).toEqual('000000');
  expect(toHex([0, 0, 0, 0])).toEqual('00000000');

  expect(toHex(1)).toEqual('ff');
  expect(toHex([1, 1, 1])).toEqual('ffffff');
  expect(toHex([1, 1, 1, 1])).toEqual('ffffffff');

  expect(toHex(-0.5)).toEqual('00');
  expect(toHex(1.5)).toEqual('ff');
  expect(toHex(0.25)).toEqual('40');
  expect(toHex(0.50)).toEqual('80');
  expect(toHex(0.751)).toEqual('c0');
});

test('uint8Map', () => {
  const scale = linearScale([0, 100], [0, 1]);
  const opacityMap = uint8Map(createOpacityMap([0, 1], scale));
  expect(opacityMap(0)).toEqual(0);
  expect(opacityMap(50)).toEqual(128);
  expect(opacityMap(100)).toEqual(255);

  const colorMap = uint8Map(createColorMap([[0, 1, 1], [0.5, 0, 0.5]], scale));
  expect(colorMap(0)).toEqual([0, 255, 255]);
  expect(colorMap(50)).toEqual([64, 128, 191]);
  expect(colorMap(100)).toEqual([128, 0, 128]);
});

test('hexMap', () => {
  const scale = linearScale([0, 100], [0, 1]);
  const opacityMap = hexMap(createOpacityMap([0, 1], scale));
  expect(opacityMap(0)).toEqual('00');
  expect(opacityMap(50)).toEqual('80');
  expect(opacityMap(100)).toEqual('ff');

  const colorMap = hexMap(createColorMap([[0, 1, 1], [0.5, 0, 0.5]], scale));
  expect(colorMap(0)).toEqual('00ffff');
  expect(colorMap(50)).toEqual('4080bf');
  expect(colorMap(100)).toEqual('800080');
});
