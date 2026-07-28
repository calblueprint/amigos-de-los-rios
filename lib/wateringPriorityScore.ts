// larger values push urgency faster
export const RECENCY_SCALE = 100;

// days scale in the exponent; higher = slower decay
export const DECAY_CONSTANT = 14;

// added only when the property has never been watered (`prev_watered` is null)
export const NEVER_WATERED_BONUS = 25;

export function parseDateOnlyInput(value: string): Date {
  const datePart = value.split("T")[0];
  const parts = datePart.split("-").map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) {
    throw new Error(`Invalid date string: ${value}`);
  }
  const [y, m, d] = parts;
  return new Date(Date.UTC(y, m - 1, d));
}

function utcCalendarDayNumber(d: Date): number {
  return Math.floor(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000,
  );
}

export function calendarDaysBetweenUtc(from: Date, to: Date): number {
  return Math.max(0, utcCalendarDayNumber(to) - utcCalendarDayNumber(from));
}

export interface WateringPriorityScoreOptions {
  recencyScale?: number;
  decayConstant?: number;
  neverWateredBonus?: number;
  asOf?: Date;
}

/**
 * urgency grows with days since last watering, saturating toward `recencyScale`.
 * never-watered properties get full saturation plus `neverWateredBonus`.
 */
export function computeWateringPriorityScore(
  prevWatered: string | Date | null | undefined,
  options?: WateringPriorityScoreOptions,
): number {
  const recencyScale = options?.recencyScale ?? RECENCY_SCALE;
  const decayConstant = options?.decayConstant ?? DECAY_CONSTANT;
  const neverWateredBonus = options?.neverWateredBonus ?? NEVER_WATERED_BONUS;
  const asOf = options?.asOf ?? new Date();

  if (prevWatered == null) {
    return recencyScale + neverWateredBonus;
  }

  const last =
    typeof prevWatered === "string"
      ? parseDateOnlyInput(prevWatered)
      : new Date(
          Date.UTC(
            prevWatered.getUTCFullYear(),
            prevWatered.getUTCMonth(),
            prevWatered.getUTCDate(),
          ),
        );

  const daysSince = calendarDaysBetweenUtc(last, asOf);
  const recencyTerm = recencyScale * (1 - Math.exp(-daysSince / decayConstant));

  return recencyTerm;
}
