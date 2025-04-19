import { redis } from './redis';

export async function getCountries() {
  const cacheKey = 'countryData';

  // 🔍 Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { data: cached, source: 'redis', timeTaken: null };
  }

  // 🌐 If not found, fetch from API
  const start = Date.now();
  const res = await fetch('https://restcountries.com/v3.1/all');
  const data = await res.json();
  const end = Date.now();

  // 💾 Save to Redis (cache for 1 hour)
  await redis.set(cacheKey, data, { ex: 3600 });

  return {
    data,
    source: 'api',
    timeTaken: ((end - start) / 1000).toFixed(2), // in seconds
  };
}
