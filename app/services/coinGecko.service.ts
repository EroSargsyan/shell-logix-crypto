const BASE_URL = process.env.EXPO_PUBLIC_COINGECKO_BASE_URL;

export async function fetchCoinsMarkets(): Promise<any[]> {
  const apiKey = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

  if (!apiKey) {
    throw new Error('Missing API key: Please provide a valid COINGECKO_API_KEY in your .env file.');
  }
  console.log('apiKey- BaseURL', apiKey, BASE_URL);
  const url = `${BASE_URL}/coins/markets?vs_currency=usd`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': apiKey,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}
