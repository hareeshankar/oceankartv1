import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

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
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
            <TextField
                variant="outlined"
                placeholder='Search for "Seafood"...'
                value={searchQuery}
                onChange={handleInputChange}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    backgroundColor: '#fff',
                    borderRadius: 1,
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {searchQuery ? (
                                <IconButton onClick={clearSearch}>
                                    <ClearIcon />
                                </IconButton>
                            ) : (
                                <SearchIcon color="action" />
                            )}
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;
