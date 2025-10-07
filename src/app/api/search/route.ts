import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FileModel from '@/models/File';

export async function GET(req: NextRequest) {
  try {
    // TODO: Add user authentication here.
    // const userId = await getUserIdFromRequest(req);
    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 });
    }

    await dbConnect();

    // The user ID should be included in the query to only search the user's own files.
    const searchResults = await FileModel.find({
      // userId: userId,
      $or: [
        { fileName: { $regex: query, $options: 'i' } }, // Case-insensitive regex search
        { folderPath: { $regex: query, $options: 'i' } },
      ],
    }).limit(50); // Limit results for performance

    return NextResponse.json({ success: true, results: searchResults });

  } catch (error) {
    console.error('Search failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Search failed', error: errorMessage }, { status: 500 });
  }
}