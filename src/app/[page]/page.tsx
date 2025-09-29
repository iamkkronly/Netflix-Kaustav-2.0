"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInputValue, setSearchInputValue] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(params.page || searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let url = '';
    if (searchQuery) {
      url = `/api/movies/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    } else {
      url = `/api/movies?page=${page}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        if (data.message && data.message.includes('Fuzzy search is not configured')) {
            setError('Fuzzy search is not yet enabled. Please contact the administrator.');
        } else {
            setError(data.message || 'An unknown error occurred');
        }
        setMovies([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    fetchData();
    if (searchQuery) {
      setSearchInputValue(searchQuery);
    }
  }, [fetchData, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) {
      router.push('/1');
    } else {
      router.push(`/?q=${encodeURIComponent(searchInputValue)}&page=1`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (searchQuery) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}&page=${newPage}`);
    } else {
      router.push(`/${newPage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-50 bg-gray-800/80 p-4 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-red-600 sm:text-3xl" style={{ cursor: 'pointer' }} onClick={() => router.push('/1')}>MovieFlix</h1>
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center sm:w-auto">
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
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
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-gray-800">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="font-bold text-white text-sm leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-red-400">{movie.name}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {totalPages > 1 && !loading && (
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