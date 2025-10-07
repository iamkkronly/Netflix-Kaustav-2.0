"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import SearchBar from '@/components/SearchBar';
import { IFile } from '@/models/File';

// A placeholder for user data
interface User {
  firstName?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<IFile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking auth
      setUser({ firstName: 'User' });
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="bg-gray-800/50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">CloudRay Dashboard</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {searchResults.length > 0 ? 'Search Results' : 'Your Files'}
              </h3>
              {isSearching ? (
                <p className="text-gray-400">Searching...</p>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((file) => (
                    <li key={file._id as string} className="text-gray-300 py-1">
                      {file.fileName} - <span className="text-xs text-gray-500">{file.folderPath}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No files to display. Use the search bar to find files.</p>
              )}
            </div>
          </div>
          <div>
            <FileUpload />
          </div>
        </div>
      </main>
    </div>
  );
}