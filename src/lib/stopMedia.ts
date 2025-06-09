// lib/stopMedia.ts

export const stopAllMediaTracks = () => {
  const stream = (window as any).localStream as MediaStream;
  if (!stream) {
    console.warn("No media stream to stop.");
    return;
  }

  Array.from(stream.getTracks()).forEach((track) => {
    console.log(`Stopping track: ${track.kind}`);
    track.stop();
  });

  (window as any).localStream = null;
};
