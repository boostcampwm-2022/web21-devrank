export function getTier(score: number): string {
  switch (true) {
    case score < 100:
      return 'yellow';
    case score < 200:
      return 'green';
    case score < 300:
      return 'mint';
    case score < 400:
      return 'blue';
    case score < 500:
      return 'purple';
    case score < 600:
      return 'orange';
    default:
      return 'rad';
  }
}
