import React, { useState } from 'react';
import Tracklist from '../Tracklist/Tracklist';
import ListPanel from '../ListPanel/ListPanel';
import styles from './Playlist.module.css';

function Playlist(props) {
  const [title, setTitle] = useState('PLAYLIST');

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const actionBtn = (
    <button className={styles.saveButton}>SAVE/EXPORT</button>
  );

  return (
    <ListPanel
      title={title}
      editable={true}
      onTitleChange={handleChange}
      action={actionBtn}
    >
      <Tracklist
        tracks={props.tracks}
        showAddButton={false}
        onRemove={props.onRemove}
      />
    </ListPanel>
  );
}

export default Playlist;
