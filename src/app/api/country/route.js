import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://discrete-iguana-16740.upstash.io",
  token: "AUFkAAIjcDFkNWQ4NTY5ZmZkOTY0YTg5YWFjOTNiZThlM2NjYWM2OXAxMA",
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get("name");

  if (!countryName) {
    return Response.json({ error: "Country name is required." }, { status: 400 });
  }

  const cacheKey = `country:${countryName.toLowerCase()}`;

  const startTime = Date.now();

  // Try getting from Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    const endTime = Date.now();
    return Response.json({
      data: cached,
      source: "cache",
      timeTakenMs: endTime - startTime,
    });
  }

  // Fetch from RESTCountries API
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!res.ok) throw new Error("Failed to fetch country data");

    const data = await res.json();
    await redis.set(cacheKey, data, { ex: 60 * 60 }); // cache for 1 hour

    const endTime = Date.now();

    return Response.json({
      data,
      source: "api",
      timeTakenMs: endTime - startTime,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
