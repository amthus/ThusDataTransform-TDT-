// React Components 
// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('pdf');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      let response;
      if (fileType === 'url') {
        response = await axios.post('http://localhost:5000/process/url', { url });
      } else {
        response = await axios.post(`http://localhost:5000/upload/${fileType}`, formData);
      }
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing file');
    }
    setLoading(false);
  };

  return (
    <div className="upload-container">
      <h2>Data Extraction Tool</h2>
      <form onSubmit={handleSubmit}>
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="csv">CSV</option>
          <option value="url">URL</option>
        </select>
        
        {fileType === 'url' ? (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
          />
        ) : (
          <input type="file" onChange={handleFileChange} />
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Process'}
        </button>
      </form>

      {result && (
        <div className="result-container">
          {fileType === 'csv' ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(result.data[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td key={j}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre>{result.text}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;