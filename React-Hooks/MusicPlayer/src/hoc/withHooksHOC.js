import React from 'react';
import useMusicPlayer from '../hooks/useMusicPlayer';

const withHooksHOC = (WrappedComponent) => {
  return (props) => {
    const { trackList, currentTrackName, playTrack, isPlaying } = useMusicPlayer();

    return <WrappedComponent 
        trackList={trackList}
        currentTrackName={currentTrackName}
        playTrack={playTrack}
        isPlaying={isPlaying}
        {...props}
    />;
  };
};

export default withHooksHOC;