import { SamePositionException } from '../exceptions/same-position.exception';

type ShiftStrategy = {
  where: {
    position: { gt?: number; gte?: number; lt?: number; lte?: number };
  };
  data: {
    position: { decrement?: number; increment?: number };
  };
};

export function getShiftStrategy(
  fromPosition: number | undefined,
  toPosition: number | undefined,
): ShiftStrategy {
  if (fromPosition === toPosition) throw new SamePositionException();

  if (fromPosition === undefined) {
    // target's first appearance
    return {
      where: {
        position: {
          gte: toPosition,
        },
      },
      data: {
        position: {
          increment: 1,
        },
      },
    };
  } else if (toPosition === undefined) {
    // target moves on the right end
    return {
      where: {
        position: {
          gt: fromPosition,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    };
  } else if (fromPosition - toPosition < 0) {
    // target moves to the right
    return {
      where: {
        position: {
          gt: fromPosition,
          lte: toPosition,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    };
  } else {
    // target moves to the left
    return {
      where: {
        position: {
          lt: fromPosition,
          gte: toPosition,
        },
      },
      data: {
        position: {
          increment: 1,
        },
      },
    };
  }
}
