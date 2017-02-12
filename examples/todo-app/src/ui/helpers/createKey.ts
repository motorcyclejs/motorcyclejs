export function createKey(): string {
  return `mc-` + Math.random().toString(36).substr(2, 6);
}
