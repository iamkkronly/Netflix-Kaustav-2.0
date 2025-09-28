"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Movie {
  _id: string;
  name: string;
  image: string;
  link: string[];
}

interface PageProps {
  params: {
    page: string;
  };
}

export default function Page({ params }: PageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const page = parseInt(params.page, 10) || 1;

  const fetchMovies = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/movies?page=${currentPage}`);
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        throw new Error(data.message || 'An unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      fetchMovies(page);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Failed to search movies');
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
        setTotalPages(1); // Reset pagination for search results
      } else {
        throw new Error(data.message || 'An unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchMovies(page);
    }
  }, [page, searchTerm, fetchMovies]);

  const handlePageChange = (newPage: number) => {
    router.push(`/${newPage}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-50 bg-gray-800/80 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-red-600">MovieFlix</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a movie..."
              className="px-4 py-2 text-white bg-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="px-4 py-2 font-bold text-white bg-red-600 rounded-r-md hover:bg-red-700">
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>Error: {error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center">
            <p>No movies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {movies.map((movie) => (
              <a key={movie._id} href={movie.link[0]} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
                  <Image
                    src={movie.image}
                    alt={movie.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center font-bold p-2">{movie.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!searchTerm.trim() && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 mx-1 font-bold text-white bg-red-600 rounded-md disabled:bg-gray-500"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 mx-1 font-bold text-white bg-red-600 rounded-md disabled:bg-gray-500"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}