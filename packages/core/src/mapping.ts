import {
  MapNode, ColorNode, OpacityNode,
  MapFunction, ColorMap, OpacityMap, ColorOpacityMap,
  RGBColor, RGBAColor, Scale, Mixer, LinearCombination
} from './types';
import { linearMixer, findIndex } from './common';

function isNode<T>(node: any | MapNode<T>) : node is MapNode<T> {
  return (<MapNode<T>>node).value !== undefined && (<MapNode<T>>node).mapped !== undefined;
}

function isNodeArray<T>(nodes: any[] | MapNode<T>[]) : nodes is MapNode<T>[] {
  return nodes.length > 0 && isNode(nodes[0]);
}

function opacityCombination(a: number, X: number, b: number, Y: number) : number {
  return a * X + b * Y;
}

function colorCombination(a: number, X: RGBColor, b: number, Y: RGBColor) : RGBColor {
  return [
    a * X[0] + b * Y[0],
    a * X[1] + b * Y[1],
    a * X[2] + b * Y[2]
  ]
}

function ensureMixer(mixer?: Mixer) : Mixer {
  return mixer ? mixer : linearMixer
}

export function createColorMap(colors: RGBColor[] | ColorNode[], scale: Scale, mixer?: Mixer) : ColorMap {
  if (!Array.isArray(colors) || colors.length < 1) {
    return noColorMap;
  }

  if (isNodeArray(colors)) {
    return createMapFromNodes(colors, scale, ensureMixer(mixer), colorCombination);
  } else {
    return createMapFromArray(colors, scale, ensureMixer(mixer), colorCombination);
  }
}

export function createOpacityMap(opacities: number[] | OpacityNode[], scale: Scale, mixer?: Mixer) : OpacityMap {
  if (!Array.isArray(opacities) || opacities.length < 1) {
    return noOpacityMap;
  }

  if (isNodeArray(opacities)) {
    return createMapFromNodes(opacities, scale, ensureMixer(mixer), opacityCombination);
  } else {
    return createMapFromArray(opacities, scale, ensureMixer(mixer), opacityCombination);
  }
}

export function createColorOpacityMap(colorMap: ColorMap, opacityMap: OpacityMap) : ColorOpacityMap {
  return function(value: number) : RGBAColor {
    return colorMap(value).concat(opacityMap(value)) as RGBAColor;
  }
}

function createMapFromNodes<T>(nodes: MapNode<T>[], scale: Scale, mixer: Mixer, linearCombination: LinearCombination<T>) : MapFunction<T> {
  const sortedNodes = nodes.sort((a, b) => a.value < b.value ? -1 : 1);

  return function(value: number) : T {
    const scaledValue = scale(value);
    const index = findIndex(sortedNodes, scaledValue, 0, sortedNodes.length - 1);
    
    if (index == 0 && scaledValue < sortedNodes[0].value) {
      return sortedNodes[index].mapped;
    } else if (index == sortedNodes.length - 1) {
      return sortedNodes[index].mapped;
    }

    const [coeff0, coeff1] = mixer(scaledValue, sortedNodes[index].value, sortedNodes[index + 1].value);
    return linearCombination(coeff0, sortedNodes[index].mapped, coeff1, sortedNodes[index + 1].mapped);
  }
}

function createMapFromArray<T>(arr: T[], scale: Scale, mixer: Mixer, linearCombination: LinearCombination<T>) : MapFunction<T> {
  return function(value: number) : T {
    const scaledValue = scale(value);
    const indexFloat = (arr.length - 1) * scaledValue;
    if (indexFloat <= 0) {
      return arr[0];
    } else if (indexFloat >= arr.length - 1) {
      return arr[arr.length - 1];
    }

    const index = Math.floor(indexFloat);
    const [coeff0, coeff1] = mixer(indexFloat, index, index + 1);
    return linearCombination(coeff0, arr[index], coeff1, arr[index + 1]);
  }
}

function noColorMap(_value: number) : RGBColor {
  return [0, 0, 0];
}

function noOpacityMap(_value: number) : number {
  return 1;
}
