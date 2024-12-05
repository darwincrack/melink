export interface URLMetadata {
  title: string;
  description: string;
  favicon: string;
}

export async function getURLMetadata(url: string): Promise<URLMetadata> {
  try {
    const response = await fetch('http://localhost:3000/api/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'Unknown Title',
      description: 'No description available',
      favicon: ''
    };
  }
}