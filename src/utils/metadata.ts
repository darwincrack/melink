export interface URLMetadata {
  title: string;
  description: string;
  favicon: string;
}

export async function getURLMetadata(urlString: unknown): Promise<URLMetadata> {
  try {
    // Asegurarnos de que urlString sea un string
    if (typeof urlString !== 'string') {
      throw new Error('URL debe ser un string');
    }

    // Asegurarnos de que la URL tenga el protocolo
    let formattedUrl = urlString;
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      formattedUrl = `https://${urlString}`;
    }

    // Validar que sea una URL válida
    const urlObject = new URL(formattedUrl);
    
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(formattedUrl)}`);
    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error(data.message || 'Error al obtener metadatos');
    }
    
    return {
      title: data.data?.title || urlObject.hostname,
      description: data.data?.description || 'No description available',
      favicon: data.data?.logo?.url || `${urlObject.origin}/favicon.ico`
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    
    // Si urlString es un string válido, intentar crear un objeto URL
    if (typeof urlString === 'string') {
      try {
        const urlObject = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
        return {
          title: urlObject.hostname,
          description: 'No description available',
          favicon: ''
        };
      } catch {
        return {
          title: urlString,
          description: 'No description available',
          favicon: ''
        };
      }
    }
    
    // Si no es un string válido, devolver valores por defecto
    return {
      title: 'Invalid URL',
      description: 'No description available',
      favicon: ''
    };
  }
}