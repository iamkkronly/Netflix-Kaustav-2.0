import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();

  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, image, link } = await req.json();

    if (!name || !image || !link || (Array.isArray(link) && link.length === 0)) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const movie = await Movie.create({ name, image, link });
    return NextResponse.json({ success: true, data: movie }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}