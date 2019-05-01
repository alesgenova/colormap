import { ColorMap, RGBColor, ColorNode, Scale, FunctionNode, Mixer } from './types';
import { linearMixer, findIndex } from './common';

function isColorNode(color: RGBColor | ColorNode) : color is ColorNode {
  return (<ColorNode>color).value !== undefined;
}

function isColorNodeArray(colors: RGBColor[] | ColorNode[]) : colors is ColorNode[] {
  return colors.length > 0 && isColorNode(colors[0]);
}

export function createColorMap(colors: RGBColor[] | ColorNode[], scale: Scale, mixer?: Mixer) : ColorMap {
  if (isColorNodeArray(colors)) {
    return createColorMapFromColorNodes(colors, scale, mixer);
  } else {
    return createColorMapFromColors(colors, scale, mixer);
  }
}

function noColorMap(_value: number) : RGBColor {
  return [0, 0, 0];
}

export function createColorMapFromColors(colors: RGBColor[], scale: Scale, mixer?: Mixer) : ColorMap {
  if (!Array.isArray(colors) || colors.length < 1) {
    return noColorMap;
  }
  if (!mixer) {
    mixer = linearMixer;
  }
  return function(value: number) : RGBColor {
    const scaledValue = scale(value);
    const indexFloat = (colors.length - 1) * scaledValue;
    if (indexFloat <= 0) {
      return colors[0];
    } else if (indexFloat >= colors.length - 1) {
      return colors[colors.length - 1];
    }

    const index = Math.floor(indexFloat);
    const [coeff0, coeff1] = mixer!(indexFloat, index, index + 1);

    let color : RGBColor = [
      coeff0 * colors[index][0] + coeff1 * colors[index + 1][0],
      coeff0 * colors[index][1] + coeff1 * colors[index + 1][1],
      coeff0 * colors[index][2] + coeff1 * colors[index + 1][2],
    ]
    return color;
  }
}

export function createColorMapFromColorNodes(colors: ColorNode[], scale: Scale, mixer?: Mixer) : ColorMap {
  if (!Array.isArray(colors) || colors.length < 1) {
    return noColorMap;
  }
  if (!mixer) {
    mixer = linearMixer;
  }
  const sortedColors = colors.sort((a, b) => a.value < b.value ? -1 : 1);

  return function(value: number) : RGBColor {
    const scaledValue = scale(value);
    const index = findIndex(sortedColors, scaledValue, 0, sortedColors.length - 1);
    
    if (index == 0 && scaledValue < sortedColors[0].value) {
      return sortedColors[index].color;
    } else if (index == sortedColors.length - 1) {
      return sortedColors[index].color;
    }

    const [coeff0, coeff1] = mixer!(scaledValue, sortedColors[index].value, sortedColors[index + 1].value);
    return [
      coeff0 * sortedColors[index].color[0] + coeff1 * sortedColors[index + 1].color[0],
      coeff0 * sortedColors[index].color[1] + coeff1 * sortedColors[index + 1].color[1],
      coeff0 * sortedColors[index].color[2] + coeff1 * sortedColors[index + 1].color[2]
    ];
  }
}
