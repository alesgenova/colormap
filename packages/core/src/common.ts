import { FunctionNode, Mixer, Vec2 } from './types';

export function findIndex(nodes: FunctionNode[], value: number, start: number, stop: number): number {
  // Find the index in the color array for which
  // nodes[index].value <= value < nodes[index + 1]
  if (stop <= start) {
    return start;
  }

  const index = Math.floor(start + (stop - start) / 2);
  const delta = value - nodes[index].value;
  const delta1 = value - nodes[index + 1].value;

  if (delta < 0) {
    return findIndex(nodes, value, start, index - 1);
  } else if (delta1 < 0) {
    return index;
  } else {
    return findIndex(nodes, value, index + 1, stop);
  }
}

export const linearMixer: Mixer = (value: number, lowerNodeValue: number, upperNodeValue: number) : Vec2 => {
  const frac = (value - lowerNodeValue) / (upperNodeValue - lowerNodeValue);
  return [1 - frac, frac];
}

export const floorMixer: Mixer = (_value: number, _lowerNodeValue: number, _upperNodeValue: number) : Vec2 => {
  return [1, 0];
}

export const ceilMixer: Mixer = (_value: number, _lowerNodeValue: number, _upperNodeValue: number) : Vec2 => {
  return [0, 1];
}

export const roundMixer: Mixer = (value: number, lowerNodeValue: number, upperNodeValue: number) : Vec2 => {
  if (value - lowerNodeValue < upperNodeValue - value) {
    return [1, 0];
  } else {
    return [0, 1];
  }
}
