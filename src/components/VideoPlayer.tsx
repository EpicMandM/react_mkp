import { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete?: () => void;
  title: string;
}

export const VideoPlayer = ({ videoUrl, onComplete, title }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setVideoEnded(true);
      if (onComplete) {
        console.log("Video ended, triggering onComplete callback");
        setTimeout(() => {
          onComplete(); // Delay the callback slightly to ensure UI updates properly
        }, 500);
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    
    if (!video) return;
    
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        
        <Box 
          onClick={handleProgressClick} 
          sx={{ 
            cursor: 'pointer',
            position: 'relative',
            mt: 1,
            height: 8
          }}
        >
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={videoEnded ? "success" : "primary"}
            sx={{ 
              height: '100%',
              borderRadius: 1
            }} 
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mt: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={togglePlay} 
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            
            <Button 
              onClick={toggleMute} 
              size="small"
              sx={{ minWidth: 'auto' }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </Button>
            
            <Typography variant="body2" sx={{ ml: 1 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
          
          <Button 
            onClick={handleFullscreen} 
            size="small"
            sx={{ minWidth: 'auto' }}
          >
            <FullscreenIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
