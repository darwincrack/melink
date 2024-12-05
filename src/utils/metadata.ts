export interface URLMetadata {
  title: string;
  description: string;
  favicon: string;
}

export async function getURLMetadata(url: string): Promise<URLMetadata> {
  try {
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    return {
      title: data.data.title || new URL(url).hostname,
      description: data.data.description || 'No description available',
      favicon: data.data.logo?.url || `${new URL(url).origin}/favicon.ico`
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: new URL(url).hostname,
      description: 'No description available',
      favicon: ''
    };
  }
}