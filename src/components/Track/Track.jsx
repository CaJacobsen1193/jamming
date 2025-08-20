import React from 'react';
import styles from './Track.module.css';

function Track(props) {

    const handleAdd = () => {
        props.onAdd(props.track)
    }

    const handleRemove =() => {
        props.onRemove(props.track)
    }

    return (
        <div className={styles.container}>
            <div className={styles.trackTop}>
                <h3 className={styles.trackName}>{props.track.name}</h3>
                {props.showAddButton && (
                <button className={styles.addButton}
                onClick={handleAdd}>+</button>
                )}
                {!props.showAddButton && (
                    <button className={styles.removeButton}
                    onClick={handleRemove}>-</button>
                )}
            </div>
            <div className={styles.trackInfo}>
                <p className={styles.artist}>{props.track.artist}</p>
                <p className={styles.album}>{props.track.album}</p>
            </div>
        </div>
    )
}

export default Track;