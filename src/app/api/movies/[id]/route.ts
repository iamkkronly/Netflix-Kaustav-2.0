import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';
import { isAuthenticated } from '@/lib/auth';

interface Context {
  params: {
    id: string;
  };
}

// Handler for updating a movie
export async function PUT(req: NextRequest, context: Context) {
  await dbConnect();

  if (!isAuthenticated(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const { name, image, link } = await req.json();

    if (!name || !image || !link || (Array.isArray(link) && link.length === 0)) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { name, image, link },
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