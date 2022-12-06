export function getTier(score: number): string {
  switch (true) {
    case score < tierCutOffs.yellow:
      return 'yellow';
    case score < tierCutOffs.green:
      return 'green';
    case score < tierCutOffs.mint:
      return 'mint';
    case score < tierCutOffs.blue:
      return 'blue';
    case score < tierCutOffs.purple:
      return 'purple';
    case score < tierCutOffs.orange:
      return 'orange';
    default:
      return 'red';
  }
}

export const tierCutOffs = {
  yellow: 100,
  green: 200,
  mint: 500,
  blue: 1000,
  purple: 2000,
  orange: 5000,
};
