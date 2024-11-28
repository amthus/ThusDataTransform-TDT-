// App.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';
import DataFilter from './components/DataFilter';
import { exportToExcel } from './utils/exportData';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDataUpload = (newData) => {
    setData(newData);
    setFilteredData(newData);
  };

  const handleFilter = (filters) => {
    const filtered = data.filter(item => {
      // Logique de filtrage personnalisée
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key].toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredData(filtered);
  };

  const handleExport = () => {
    exportToExcel(filteredData, 'exported_data');
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          ThusData Transform
        </Typography>

        <FileUpload 
          onUploadSuccess={handleDataUpload}
          setLoading={setLoading}
        />

        <Box my={3}>
          <DataFilter onFilter={handleFilter} />
        </Box>

        {loading ? (
          <Typography>Chargement en cours...</Typography>
        ) : (
          <>
            <Box my={3}>
              <DataChart data={filteredData} />
            </Box>

            <Box my={3}>
              <DataTable 
                data={filteredData}
                onExport={handleExport}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;