import { Range, Scale } from './types';

export function linearScale(domain: Range, range: Range) : Scale {
  let [d0, d1] = domain;
  const [r0, r1] = range;
  if (Math.abs(d0 - d1) < Number.EPSILON) {
    d1 = d0 + 1;
  }
  return function(value:number) : number {
    return r0 + (r1 - r0) * ((value - d0) / (d1 - d0));
  }
};
