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


    return (
        <div className={styles.searchBar}>
            <input className={styles.input}
             placeholder='Search By Song Name'
             onChange={handleChange}
             value={term}/>
            <button className={styles.submit}
            onClick={search}>Search</button>
        </div>
    )
}

export default SearchBar;