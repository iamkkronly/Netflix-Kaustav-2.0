import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FileModel from '@/models/File';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // TODO: Add user authentication here.
    // const userId = await getUserIdFromRequest(req);
    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ message: 'File ID is required' }, { status: 400 });
    }

    await dbConnect();

    const file = await FileModel.findById(fileId);

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    // Check if user is the owner of the file
    // if (file.userId.toString() !== userId) {
    //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

    if (!file.isShared || !file.shareToken) {
      file.isShared = true;
      file.shareToken = crypto.randomBytes(16).toString('hex');
      await file.save();
    }

    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/share/${file.shareToken}`;

    return NextResponse.json({ success: true, shareLink });

  } catch (error) {
    console.error('Failed to create share link:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to create share link', error: errorMessage }, { status: 500 });
  }
}