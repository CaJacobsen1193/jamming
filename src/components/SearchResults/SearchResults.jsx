import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import ListPanel from '../ListPanel/ListPanel';

function SearchResults(props) {
  return (
    <ListPanel title="RESULTS">
      <Tracklist
        tracks={props.tracks}
        showAddButton={true}
        onAdd={props.onAdd}
      />
    </ListPanel>
  );
}

export default SearchResults;
