import Decimal from 'decimal.js-light';

Decimal.set({ precision: 32 });

export interface ReferenceOrbit {
  Zr: Float64Array;
  Zi: Float64Array;
  // Number of valid entries. May be < maxIter if the reference point escapes the set.
  length: number;
}

/**
 * Computes the reference orbit at (centerX, centerY) using high-precision arithmetic.
 * The result is stored as float64 arrays for fast transfer to workers.
 *
 * Limitation: centerX/centerY are float64, so precision gains only matter up to
 * zoom levels where float64 center coordinates themselves are still accurate (~1e15).
 * Storing center as Decimal would be required to go beyond that.
 */
export function computeReferenceOrbit(
  centerX: number,
  centerY: number,
  maxIter: number
): ReferenceOrbit {
  const Cr = new Decimal(centerX);
  const Ci = new Decimal(centerY);

  const Zr = new Float64Array(maxIter);
  const Zi = new Float64Array(maxIter);

  let zr = new Decimal(0);
  let zi = new Decimal(0);

  let length = maxIter;

  for (let n = 0; n < maxIter; n++) {
    Zr[n] = zr.toNumber();
    Zi[n] = zi.toNumber();

    const zr2 = zr.mul(zr);
    const zi2 = zi.mul(zi);

    if (zr2.add(zi2).gt(4)) {
      length = n;
      break;
    }

    const newZr = zr2.sub(zi2).add(Cr);
    const newZi = zr.mul(zi).mul(2).add(Ci);
    zr = newZr;
    zi = newZi;
  }

  return { Zr, Zi, length };
}
