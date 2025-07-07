import { MotionItem } from '@/types/content';
import { isYouTubeUrl, extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube-utils';

interface VideoPlayerProps {
  video: MotionItem;
  className?: string;
}

const VideoPlayer = ({ video, className = '' }: VideoPlayerProps) => {
  // Check if it's a YouTube video
  const youTubeId = video.youTubeId || extractYouTubeId(video.src);
  const isYouTube = video.isYouTube || isYouTubeUrl(video.src);

  if (isYouTube && youTubeId) {
    return (
      <div className={`relative aspect-video overflow-hidden ${className}`}>
        <iframe
          className="w-full h-full"
          src={getYouTubeEmbedUrl(youTubeId)}
          title={video.alt}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Regular video file
  return (
    <div className={`relative aspect-video overflow-hidden ${className}`}>
      <video
        className="w-full h-full object-cover"
        controls
        poster={video.src}
        preload="metadata"
      >
        <source src={video.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;