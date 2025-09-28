import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movie from '@/models/Movie';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ success: false, message: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const movies = await Movie.find({
      name: { $regex: query, $options: 'i' },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: movies });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Server Error', error: errorMessage }, { status: 500 });
  }
}