// Simple string hash function for deterministic seeding
export const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Deterministic shuffle based on seed
export const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const result = [...array];
  let m = result.length;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  while (m) {
    const i = Math.floor(rng() * m--);
    [result[m], result[i]] = [result[i], result[m]];
  }
  return result;
};
