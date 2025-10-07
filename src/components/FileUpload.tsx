"use client";

import { useState } from 'react';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileName', file.name);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Chunk upload failed');
        }

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      } catch (error) {
        console.error('Error uploading chunk:', error);
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    alert('File uploaded successfully!');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Upload a File</h3>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <div className="mt-4">
          <p className="text-gray-300">Selected file: {file.name}</p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload'}
          </button>
        </div>
      )}
      {uploading && (
        <div className="w-full bg-gray-600 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}