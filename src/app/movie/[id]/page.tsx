"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Movie {
  _id: string;
  name: string;
  image: string;
  downloadLinks: {
    p480?: string;
    p720?: string;
    p1080?: string;
  };
}

export default function MovieDetailsPage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/movies/${id}`);
          const data = await res.json();
          if (data.success) {
            setMovie(data.data);
          } else {
            setError(data.message || 'Failed to load movie details.');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading movie details...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-400">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src={movie.image}
              alt={movie.name}
              width={500}
              height={750}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.name}</h1>
            <div className="space-y-4">
              {movie.downloadLinks.p480 && (
                <a href={movie.downloadLinks.p480} target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700">
                  Download 480p
                </a>
              )}
              {movie.downloadLinks.p720 && (
                <a href={movie.downloadLinks.p720} target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700">
                  Download 720p
                </a>
              )}
              {movie.downloadLinks.p1080 && (
                <a href={movie.downloadLinks.p1080} target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-md bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700">
                  Download 1080p
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}