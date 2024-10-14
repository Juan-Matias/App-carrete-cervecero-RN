import { useState } from 'react';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      // Simulación de una búsqueda en API
      const response = await fetch(`https://api.example.com/search?q=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error realizando la búsqueda:', error);
    }
  };

  return { query, setQuery, results, handleSearch };
};

export default useSearch;
