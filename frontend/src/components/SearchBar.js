import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        if (onSearch) {
            onSearch(''); // Notify parent to reset the search results
        }
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar-wrapper">
                <input
                    type="text"
                    className="search-bar"
                    placeholder='Search for "Seafood"...'
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <button
                    className="search-icon-button"
                    onClick={searchQuery ? clearSearch : null}
                >
                    {searchQuery ? (
                        <span role="img" aria-label="clear">❌</span> // Cross icon
                    ) : (
                        <span role="img" aria-label="search">🔍</span> // Search icon
                    )}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
