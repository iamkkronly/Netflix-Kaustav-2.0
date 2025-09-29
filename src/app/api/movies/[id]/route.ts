import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { isAuthenticated } from '@/lib/auth';

// Define the standard context for a dynamic route handler in Next.js
interface Context {
  params: {
    id: string;
  };
}

// Handler for fetching a single movie by its ID
export async function GET(req: NextRequest, context: Context) {
  await dbConnect();

  try {
    const { id } = context.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}

// Handler for updating a movie
export async function PUT(req: NextRequest, context: Context) {
  await dbConnect();

  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const { name, image, downloadLinks } = await req.json();

    if (!name || !image || !downloadLinks) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { name, image, downloadLinks },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMovie });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}

// Handler for deleting a movie
export async function DELETE(req: NextRequest, context: Context) {
  await dbConnect();

  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}