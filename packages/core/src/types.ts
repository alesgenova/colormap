export type Range = [number, number];
export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type ColorNode = {value: number; color: RGBColor};
export type Scale = (value: number) => number;
export type ColorMap = (value: number) => RGBColor;
export type MapMode = 'interpolate' | 'nearest' | 'floor';
