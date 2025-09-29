"use client";

import { useState, useEffect, useCallback } from 'react';

interface Movie {
  _id: string;
  name: string;
  image: string;
  link: string[];
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form and movie list state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [movieName, setMovieName] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [movieLinks, setMovieLinks] = useState('');
  const [message, setMessage] = useState('');

  // Search and Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);
  const [adminTotalPages, setAdminTotalPages] = useState(1);

  const fetchMovies = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    let url = '';
    if (query) {
      url = `/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`;
    } else {
      url = `/api/movies?page=${page}&limit=10`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMovies(data.data);
        setAdminTotalPages(data.pagination.totalPages);
      } else {
        setMovies([]);
        setAdminTotalPages(1);
        setMessage(data.message || 'Failed to fetch movies.');
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMessage("Failed to load movies.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMovies(adminCurrentPage, searchQuery);
    }
  }, [isAuthenticated, adminCurrentPage, searchQuery, fetchMovies]);

  // Initial auth check
  useEffect(() => {
    if (document.cookie.includes('auth_token')) {
      setIsAuthenticated(true);
    } else {
        setIsLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setIsAuthenticated(true);
    } else {
      setMessage(data.message || 'Login failed');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (rest of the form submission logic is the same)
    const links = movieLinks.split('\n').map(link => link.trim()).filter(link => link);
    if (links.length === 0) {
      setMessage('Please provide at least one movie link.');
      return;
    }
    const movieData = { name: movieName, image: imageLink, link: links };
    const url = editingMovieId ? `/api/movies/${editingMovieId}` : '/api/movies';
    const method = editingMovieId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(movieData) });
    const data = await res.json();
    if (data.success) {
      setMessage(editingMovieId ? 'Movie updated successfully!' : 'Movie added successfully!');
      resetForm();
      fetchMovies(adminCurrentPage, searchQuery);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setMovieName(movie.name);
    setImageLink(movie.image);
    setMovieLinks(movie.link.join('\n'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      // ... (rest of the delete logic is the same)
      const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage('Movie deleted successfully!');
        fetchMovies(adminCurrentPage, searchQuery);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    }
  };

  const resetForm = () => {
    setEditingMovieId(null);
    setMovieName('');
    setImageLink('');
    setMovieLinks('');
  };

  const handleAdminPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= adminTotalPages) {
      setAdminCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setAdminCurrentPage(1); // Reset to first page on new search
  }

  if (isLoading && !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-xl">
          <h1 className="mb-4 text-center text-2xl font-bold text-white">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="mb-4 w-full rounded-md bg-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="submit" className="w-full rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">Login</button>
          {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleFormSubmit} className="mb-8 rounded-lg bg-gray-800 p-6 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
            {editingMovieId ? 'Edit Movie' : 'Add New Movie'}
          </h1>
          {message && <p className="mb-4 text-center text-green-400">{message}</p>}
          <div className="mb-4"><input type="text" value={movieName} onChange={(e) => setMovieName(e.target.value)} placeholder="Movie Name" required className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
          <div className="mb-4"><input type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} placeholder="Image Link" required className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
          <div className="mb-6"><textarea value={movieLinks} onChange={(e) => setMovieLinks(e.target.value)} placeholder="Movie Links (one per line)" required rows={4} className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" /></div>
          <div className="flex gap-4">
            <button type="submit" className="flex-grow rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">{editingMovieId ? 'Update Movie' : 'Add Movie'}</button>
            {editingMovieId && (<button type="button" onClick={resetForm} className="rounded-md bg-gray-600 px-4 py-3 font-bold text-white hover:bg-gray-500">Cancel</button>)}
          </div>
        </form>

        <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Existing Movies</h2>
            <input type="text" placeholder="Search movies..." value={searchQuery} onChange={handleSearchChange} className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="space-y-4">
            {movies.map((movie) => (
              <div key={movie._id} className="flex items-center justify-between rounded-md bg-gray-700 p-4">
                <span className="truncate pr-4">{movie.name}</span>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => handleEdit(movie)} className="rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDelete(movie._id)} className="rounded bg-red-600 px-3 py-1 text-sm font-bold text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {adminTotalPages > 1 && (
            <div className="mt-8 flex items-center justify-center">
              <button onClick={() => handleAdminPageChange(adminCurrentPage - 1)} disabled={adminCurrentPage <= 1} className="mx-1 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-600">Previous</button>
              <span className="px-4 py-2 text-sm">Page {adminCurrentPage} of {adminTotalPages}</span>
              <button onClick={() => handleAdminPageChange(adminCurrentPage + 1)} disabled={adminCurrentPage >= adminTotalPages} className="mx-1 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-600">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}