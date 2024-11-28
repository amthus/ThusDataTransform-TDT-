// src/components/DataFilter.js
import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';

const DataFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        name="search"
        label="Rechercher"
        variant="outlined"
        size="small"
        onChange={handleFilterChange}
      />
    </Box>
  );
};

export default DataFilter;