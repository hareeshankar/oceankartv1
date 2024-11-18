import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        if (onSearch) {
            onSearch(''); // Clear the search value in the parent component
        }
    };

    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-bar"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
            />
            {searchQuery && (
                <button className="clear-button" onClick={handleClear}>
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBar
