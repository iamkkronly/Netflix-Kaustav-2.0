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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-red-600 sm:text-3xl">MovieFlix</h1>
          <form onSubmit={handleSearch} className="flex w-full items-center sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a movie..."
              className="w-full rounded-l-md bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="rounded-r-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {movies.map((movie) => (
              <a key={movie._id} href={movie.link[0]} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={movie.image}
                    alt={movie.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 p-2 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-bold text-white">{movie.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!searchTerm.trim() && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="mx-1 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-600"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="mx-1 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}