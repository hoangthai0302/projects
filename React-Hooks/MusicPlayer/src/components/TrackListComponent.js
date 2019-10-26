import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import withHooksHOC from '../hoc/withHooksHOC';

class TrackList extends React.Component {
    render() {

        const { trackList, currentTrackName, playTrack, isPlaying } = this.props;
        return (
            <>
                {trackList.map((track, index) => (
                    <div className="box">
                        <button className="button" onClick={() => playTrack(index)}>
                            {currentTrackName === track.name && isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                        </button>
                        <div className="song-title">
                            {track.name}
                        </div>
                    </div>
                ))}
            </>
        )
    }
}

export default withHooksHOC(TrackList)
