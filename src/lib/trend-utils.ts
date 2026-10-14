export interface TrendResult {
  direction: "up" | "down" | "neutral" | "unavailable";
  percentChange: number | null;
  absoluteChange: number | null;
  formattedText: string;
  isFavorable: boolean;
}

export function calculateTrend(
  current: number | null | undefined,
  previous: number | null | undefined,
  options: {
    isHigherBetter?: boolean;
    periodLabel?: string;
    displayMode?: "percent" | "absolute";
  } = {}
): TrendResult {
  const {
    isHigherBetter = true,
    periodLabel = "this month",
    displayMode = "percent",
  } = options;

  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined
  ) {
    return {
      direction: "unavailable",
      percentChange: null,
      absoluteChange: null,
      formattedText: "No historical data",
      isFavorable: true,
    };
  }

  const diff = current - previous;

  // Handle case when previous period was 0
  if (previous === 0) {
    if (current === 0) {
      return {
        direction: "neutral",
        percentChange: 0,
        absoluteChange: 0,
        formattedText: `0% ${periodLabel}`,
        isFavorable: true,
      };
    }
    const isFavorable = isHigherBetter ? current > 0 : current < 0;
    return {
      direction: "up",
      percentChange: 100,
      absoluteChange: diff,
      formattedText: displayMode === "absolute" ? `+${diff} ${periodLabel}` : `+100% ${periodLabel}`,
      isFavorable,
    };
  }

  const rawPercent = (diff / previous) * 100;
  const percentChange = Math.round(rawPercent);

  if (diff === 0) {
    return {
      direction: "neutral",
      percentChange: 0,
      absoluteChange: 0,
      formattedText: `0% ${periodLabel}`,
      isFavorable: true,
    };
  }

  const isUp = diff > 0;
  const direction = isUp ? "up" : "down";
  const isFavorable = isHigherBetter ? isUp : !isUp;

  const sign = isUp ? "+" : "";
  const textValue =
    displayMode === "absolute"
      ? `${sign}${diff} ${periodLabel}`
      : `${sign}${percentChange}% ${periodLabel}`;

  return {
    direction,
    percentChange,
    absoluteChange: diff,
    formattedText: textValue,
    isFavorable,
  };
}
