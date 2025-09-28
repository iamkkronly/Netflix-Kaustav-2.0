import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import Fuse from 'fuse.js';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ success: false, message: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // 1. Fetch all movies from the database to be searched.
    const allMovies = await Movie.find({}).sort({ createdAt: -1 });

    // 2. Set up Fuse.js for a powerful, self-contained fuzzy search.
    const fuse = new Fuse(allMovies, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.4, // Adjust this for more or less strict matching.
    });

    // 3. Perform the search.
    const fuseResults = fuse.search(query);
    const searchResults = fuseResults.map(result => result.item);

    // 4. Manually paginate the in-memory search results.
    const paginatedMovies = searchResults.slice(skip, skip + limit);
    const totalMovies = searchResults.length;
    const totalPages = Math.ceil(totalMovies / limit);

    return NextResponse.json({
      success: true,
      data: paginatedMovies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
      },
    });

  } catch (error) {
    console.error("Search API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}