import React, { useState } from 'react';
import styles from './SearchBar.module.css'

function SearchBar(props) {
    const [term, setTerm] = useState('');

    const handleChange = (e) => {
        setTerm(e.target.value);
    }

    const search = () => {
        if (!term.trim()) return;
        props.onSearch(term.trim());
        setTerm('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            search();
        }
    }


    return (
        <div className={styles.searchBar}>
            <input className={styles.input}
             placeholder='Search'
             onChange={handleChange}
             value={term}
             onKeyDown={handleKeyDown}/>
            <button 
            className={styles.submit}
            onClick={search}>FIND TRACKS
            </button>
        </div>
    )
}

export default SearchBar;