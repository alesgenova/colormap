export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type Range = Vec2
export type RGBColor = Vec3;
export type RGBAColor = Vec4;
export interface FunctionNode {
  value: number;
};
export interface ColorNode extends FunctionNode {
  color: RGBColor;
};
export interface OpacityNode extends FunctionNode {
  opacity: number;
};
export type Scale = (value: number) => number;
export type Mixer = (value: number, lowerNodeValue: number, upperNodeValue: number) => Vec2;
export type ColorMap = (value: number) => RGBColor;
export type OpacityMap = (value: number) => number;
export type MapMode = 'interpolate' | 'nearest' | 'floor';
