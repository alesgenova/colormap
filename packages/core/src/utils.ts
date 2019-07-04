import { Vec4, Vec3, MapFunction } from './types';

function uint8(value: number) : number {
  if (value < 0) {
    return 0;
  } else if (value > 1) {
    return 255;
  } else {
    return Math.round(value * 255);
  }
}

function hex(value: number) : string {
  let result = uint8(value).toString(16);
  return result.length < 2 ? '0' + result : result;
}

function isColor(mapped: MapValue<number>) : mapped is Vec4<number> | Vec3<number> {
  return Array.isArray(mapped);
}

type MapValue<T> = Vec4<T> | Vec3<T> | T;

type Conversion<T, U> = (value: T) => U;

export function toUint8<T extends MapValue<number>>(mapped: T) : T {
  if (isColor(mapped)) {
    return mapped.map(v => uint8(v)) as T;
  } else {
    return uint8((mapped as number)) as T;
  }
}

export function toHex<T extends MapValue<number>>(mapped: T) : string {
  if (isColor(mapped)) {
    return mapped.map(v => hex(v)).join('');
  } else {
    return hex((mapped as number));
  }
}

function convertMap<T extends MapValue<number>, U>(map: MapFunction<T>, conversion: Conversion<T, U>) : MapFunction<U> {
  return function(value: number) : U {
    return conversion(map(value));
  }
}

export function uint8Map<T extends MapValue<number>>(map: MapFunction<T>) : MapFunction<T> {
  return convertMap(map, toUint8);
}

export function hexMap<T extends MapValue<number>>(map: MapFunction<T>) : MapFunction<string> {
  return convertMap(map, toHex);
}
