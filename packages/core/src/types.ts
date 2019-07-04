export type Vec2<T> = [T, T];
export type Vec3<T> = [T, T, T];
export type Vec4<T> = [T, T, T, T];
export type Range = Vec2<number>
export type RGBColor = Vec3<number>;
export type RGBAColor = Vec4<number>;

export interface BaseNode{
  value: number;
}
export interface MapNode<T> extends BaseNode {
  mapped: T
};
export interface ColorNode extends MapNode<RGBColor>{};
export interface OpacityNode extends MapNode<number>{};
export type Scale = (value: number) => number;
export type Mixer = (value: number, lowerNodeValue: number, upperNodeValue: number) => Vec2<number>;
export type LinearCombination<T> = (a: number, X: T, b: number, Y: T) => T;
export type MapFunction<T> = (value: number) => T;
export type ColorMap = MapFunction<RGBColor>;
export type OpacityMap = MapFunction<number>;
export type ColorOpacityMap = MapFunction<RGBAColor>;
