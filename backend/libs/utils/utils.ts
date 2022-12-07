const tierOffset = {
  yellow: 0,
  green: 100,
  mint: 200,
  blue: 500,
  purple: 1000,
  orange: 2000,
  red: 5000,
} as const;

export function getTier(score: number): string {
  switch (true) {
    case score >= tierOffset.red:
      return 'red';
    case score >= tierOffset.orange:
      return 'orange';
    case score >= tierOffset.purple:
      return 'purple';
    case score >= tierOffset.blue:
      return 'blue';
    case score >= tierOffset.mint:
      return 'mint';
    case score >= tierOffset.green:
      return 'green';
    default:
      return 'yellow';
  }
}

export function getStartExp(score: number): number {
  const tier = getTier(score);
  return tierOffset[tier];
}

export function getNeedExp(score: number): number {
  const tier = getTier(score);
  switch (tier) {
    case 'red':
      return 0;
    case 'orange':
      return tierOffset.red - score - 1;
    case 'purple':
      return tierOffset.orange - score - 1;
    case 'blue':
      return tierOffset.purple - score - 1;
    case 'mint':
      return tierOffset.blue - score - 1;
    case 'green':
      return tierOffset.mint - score - 1;
    default:
      return tierOffset.green - score - 1;
  }
}
