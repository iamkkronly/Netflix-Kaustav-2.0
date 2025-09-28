"use client";

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [movieName, setMovieName] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [movieLinks, setMovieLinks] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (document.cookie.includes('auth_token')) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
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

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const links = movieLinks.split('\n').map(link => link.trim()).filter(link => link);
    if (links.length === 0) {
      setMessage('Please provide at least one movie link.');
      return;
    }
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: movieName, image: imageLink, link: links }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Movie added successfully!');
      setMovieName('');
      setImageLink('');
      setMovieLinks('');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  if (isLoading) {
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
          <button type="submit" className="w-full rounded-md bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">
            Login
          </button>
          {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <form onSubmit={handleAddMovie} className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">Add New Movie</h1>
        <div className="mb-4">
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Movie Name"
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            placeholder="Image Link"
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="mb-6">
          <textarea
            value={movieLinks}
            onChange={(e) => setMovieLinks(e.target.value)}
            placeholder="Movie Links (one per line)"
            required
            rows={4}
            className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button type="submit" className="w-full rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800">
          Add Movie
        </button>
        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}