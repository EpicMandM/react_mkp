import { useRef, useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import ReactPlayer from 'react-player';
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
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Handlers for ReactPlayer callbacks
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.played * 100);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setVideoEnded(true);
    if (onComplete) {
      console.log('Video ended, triggering onComplete callback');
      setTimeout(() => onComplete(), 500);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleFullscreen = () => {
    if (wrapperRef.current && wrapperRef.current.requestFullscreen) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seconds = clickPosition * duration;
    playerRef.current?.seekTo(seconds, 'seconds');
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
      
      {/* Responsive video container with 16:9 aspect ratio */}
      <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' }} ref={wrapperRef}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          muted={isMuted}
          controls={false}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
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
