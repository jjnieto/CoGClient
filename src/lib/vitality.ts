const MAX_VITALITY = 86400;

export function computeCurrentVitality(
  storedVitality: number,
  lastVitalityUpdate: number,
  nowSeconds?: number,
): number {
  const now = nowSeconds ?? Math.trunc(Date.now() / 1000);
  const elapsed = Math.max(0, now - lastVitalityUpdate);
  return Math.min(storedVitality + elapsed, MAX_VITALITY);
}

export function formatVitality(vitality: number): string {
  const hours = Math.trunc(vitality / 3600);
  const minutes = Math.trunc((vitality % 3600) / 60);
  const seconds = vitality % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export { MAX_VITALITY };
