import React from 'react';
import Track from '../Track/Track';
import styles from './Tracklist.module.css';

function Tracklist(props) {

    
    return (
        <div className={styles.tracks}>
            {
                props.tracks.map((track) => 
                    <Track key={track.id}  
                    track={track}
                    showAddButton={props.showAddButton}
                    onAdd={props.onAdd}
                    onRemove={props.onRemove}/>
                )
            }
        </div>
    )
}

export default Tracklist;