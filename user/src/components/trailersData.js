// Utility: extract thumbnail from youtube URL
export const getThumbnail = (url) => {
  let videoId;
  if (url.includes("youtu.be/")) {
    videoId = url.split("/").pop();
  } else {
    const params = new URL(url).searchParams;
    videoId = params.get("v");
  }
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Example trailer list
export const trailers = [
  { videoUrl: 'https://www.youtube.com/watch?v=ZuaseSovWDY' },
  { videoUrl: 'https://www.youtube.com/watch?v=8QVYLudMjJA' },
  { videoUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg' },
  { videoUrl: 'https://www.youtube.com/watch?v=HihakYi5M2I' },
  { videoUrl: 'https://www.youtube.com/watch?v=dYnIQriEp_c' },
  { videoUrl: 'https://www.youtube.com/watch?v=Qah9sSIXJqk' },
  { videoUrl: 'https://www.youtube.com/watch?v=nQnC7i2VlbI' },
  { videoUrl: 'https://www.youtube.com/watch?v=Eb9fIMlIiyc' },
  { videoUrl: 'https://www.youtube.com/watch?v=7TavVZMewpY' },
  { videoUrl: 'https://www.youtube.com/watch?v=WKHZqYJrrUw' },
];
