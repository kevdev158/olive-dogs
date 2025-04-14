import React, { useState, useEffect } from 'react';
import { Dog } from './types/dog';
import { fetchDogs } from './services/dogService';

const API_PAGE_SIZE = 7;
const ITEMS_PER_PAGE = 15;
const PLACEHOLDER_IMAGE = 'placeholder_dog.png';

function App() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadDogs = async () => {
      setLoading(true);
      setError(null);
      
      const allDogs: Dog[] = [];

      // calculate the start and end index for the items in the current page
      const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageEnd = pageStart + ITEMS_PER_PAGE;

      // calculate the start and end page number for the API
      const apiPageStart = Math.floor(pageStart / API_PAGE_SIZE) + 1;
      const apiPageEnd = Math.floor((pageEnd - 1) / API_PAGE_SIZE) + 1;

      const promises = [];
      for (let pageNum = apiPageStart; pageNum <= apiPageEnd; pageNum++) {
        promises.push(fetchDogs(pageNum));
      }

      const pages = await Promise.allSettled(promises);
      if (ignore) return; // discard stale promises

      allDogs.push(...pages.flatMap((result) => {
        if (result.status === 'fulfilled') {
          return result.value.data || [];
        }
        const placeholders = [];
        for (let i = 0; i < API_PAGE_SIZE; i++) {
          placeholders.push({breed: "", image: PLACEHOLDER_IMAGE});
        }
        return placeholders;
      }));

      const currentIndex = (apiPageStart - 1) * API_PAGE_SIZE;
      const offset = pageStart - currentIndex;
      
      setDogs(allDogs.slice(offset, offset + ITEMS_PER_PAGE));
      setLoading(false);
    };

    loadDogs();

    return () => {
      ignore = true;
    }
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(12, prev + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Dog Breeds</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Loading dogs...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {dogs.map((dog, index) => (
              <div 
                key={`${dog.breed}-${index}`} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img 
                  src={dog.image || PLACEHOLDER_IMAGE} 
                  alt={dog.breed}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <h3 className="text-lg font-semibold text-gray-800 p-4 text-center">
                  {dog.breed}
                </h3>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-200`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-lg">Page {currentPage}</span>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === 12}
              className={`px-4 py-2 rounded ${
                currentPage === 12 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors duration-200`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
