/**
 * Retourne l'URL embed (YouTube ou Vimeo) à partir d'une URL de vidéo quelconque.
 * Retourne null si le format n'est pas reconnu.
 */
export const getVideoEmbedUrl = (url: string): string | null => {
  // YouTube : watch?v=, youtu.be/, shorts/, embed/
  const ytPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of ytPatterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }

  // Vimeo : vimeo.com/ID ou player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`;
  }

  return null;
};
