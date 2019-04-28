import { ColorMap, RGBColor, ColorNode, Scale } from './types';

function isColorNode(color: RGBColor | ColorNode) : color is ColorNode {
  return (<ColorNode>color).value !== undefined;
}

function isColorNodeArray(colors: RGBColor[] | ColorNode[]) : colors is ColorNode[] {
  return colors.length > 0 && isColorNode(colors[0]);
}

export function createColorMap(colors: RGBColor[] | ColorNode[], scale: Scale) : ColorMap {
  if (isColorNodeArray(colors)) {
    return createColorMapFromColorNodes(colors, scale);
  } else {
    return createColorMapFromColors(colors, scale);
  }
}

function noColorMap(_value: number) : RGBColor {
  return [0, 0, 0];
}

export function createColorMapFromColors(colors: RGBColor[], scale: Scale) : ColorMap {
  if (!Array.isArray(colors) || colors.length < 1) {
    return noColorMap;
  }
  return function(value: number) : RGBColor {
    const scaledValue = scale(value);
    let indexFloat = (colors.length - 1) * scaledValue;
    if (indexFloat <= 0) {
      return colors[0];
    } else if (indexFloat >= colors.length - 1) {
      return colors[colors.length - 1];
    }

    let index = Math.floor(indexFloat);
    let delta = indexFloat - index;

    let color : RGBColor = [
      (1 - delta) * colors[index][0] + delta * colors[index + 1][0],
      (1 - delta) * colors[index][1] + delta * colors[index + 1][1],
      (1 - delta) * colors[index][2] + delta * colors[index + 1][2],
    ]
    return color;
  }
}

export function findIndex(colors: ColorNode[], value: number, start: number, stop: number): number {
  // Find the index in the color array for which
  // colors[index].value <= value < colors[index + 1]
  if (stop <= start) {
    return start;
  }

  const index = Math.floor(start + (stop - start) / 2);
  const delta = value - colors[index].value;
  const delta1 = value - colors[index + 1].value;

  if (delta < 0) {
    return findIndex(colors, value, start, index - 1);
  } else if (delta1 < 0) {
    return index;
  } else {
    return findIndex(colors, value, index + 1, stop);
  }
}

export function createColorMapFromColorNodes(colors: ColorNode[], scale: Scale) : ColorMap {
  if (!Array.isArray(colors) || colors.length < 1) {
    return noColorMap;
  }
  const sortedColors = colors.sort((a, b) => a.value < b.value ? -1 : 1);

  return function(value: number) : RGBColor {
    const scaledValue = scale(value);
    const index = findIndex(sortedColors, scaledValue, 0, sortedColors.length - 1);
    const delta = scaledValue - sortedColors[index].value;
    if (index == 0 && delta < 0) {
      return sortedColors[index].color;
    } else if (index == sortedColors.length - 1) {
      return sortedColors[index].color;
    } else {
      const frac = delta / (sortedColors[index + 1].value - sortedColors[index].value);
      return [
        (1 - frac) * sortedColors[index].color[0] + frac * sortedColors[index + 1].color[0],
        (1 - frac) * sortedColors[index].color[1] + frac * sortedColors[index + 1].color[1],
        (1 - frac) * sortedColors[index].color[2] + frac * sortedColors[index + 1].color[2]
      ];
    }
  }
}
