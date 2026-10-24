export function projectOutreach(currentScore: number, addedPoints: number) {
  const projectedScore = Math.min(98, currentScore + addedPoints);
  const baselineCalls = Math.round(1 + currentScore * 0.10);
  const projectedCalls = Math.round(3 + projectedScore * 0.16);

  return {
    projectedScore,
    baselineCalls,
    projectedCalls
  };
}
