import { getCountries } from '@/src/lib/getCountries';

export async function GET() {
  try {
    const { data, source, timeTaken } = await getCountries();

    return Response.json({
      countries: data,
      source,
      timeTaken,
    });
  } catch (err) {
    return Response.json(
      { error: 'Failed to fetch countries data' },
      { status: 500 }
    );
  }
}
