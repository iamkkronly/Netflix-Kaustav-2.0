import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm, File } from 'formidable';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import dbConnect from '@/lib/db';
import FileModel from '@/models/File';
import User from '@/models/User';

// Disable Next.js body parsing to allow formidable to handle the stream
export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = '/tmp/uploads';

// Ensure the upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

async function parseForm(req: NextRequest): Promise<{ fields: any; files: { [key: string]: File | File[] } }> {
  return new Promise(async (resolve, reject) => {
    await ensureUploadDir();
    const form = new IncomingForm({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB chunk size limit, for safety
    });

    // Convert NextRequest to a Node.js-like request object
    const reqAsAny = req as any;
    const readableStream = reqAsAny.body || new ReadableStream();

    // This is a workaround to make formidable work with Next.js 13+ App Router
    const chunks: Uint8Array[] = [];
    const reader = readableStream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);

    form.parse(Buffer.from(buffer) as any, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Note: Authentication should be handled here.
    // For now, we'll assume the user is authenticated and we have their ID.
    // const userId = await getUserIdFromRequest(req); // Placeholder for auth logic

    const { fields, files } = await parseForm(req);
    const chunk = files.chunk as File;
    const { fileName, chunkIndex, totalChunks } = fields;

    const chunkDir = path.join(UPLOAD_DIR, fileName);
    await fs.mkdir(chunkDir, { recursive: true });

    const chunkPath = path.join(chunkDir, `${chunkIndex}`);
    await fs.rename(chunk.filepath, chunkPath);

    if (parseInt(chunkIndex, 10) === parseInt(totalChunks, 10) - 1) {
      // All chunks have been uploaded, reassemble the file
      const finalFilePath = path.join(UPLOAD_DIR, fileName + '_final');
      const writeStream = await fs.open(finalFilePath, 'w');

      for (let i = 0; i < totalChunks; i++) {
        const assembledChunkPath = path.join(chunkDir, `${i}`);
        const chunkBuffer = await fs.readFile(assembledChunkPath);
        await writeStream.write(chunkBuffer);
        await fs.unlink(assembledChunkPath); // Clean up chunk
      }
      await writeStream.close();
      await fs.rmdir(chunkDir); // Clean up chunk directory

      // TODO: Upload `finalFilePath` to Telegram
      console.log(`File ${fileName} reassembled at ${finalFilePath}`);

      // TODO: Save file metadata to MongoDB

      // Clean up the final file
      await fs.unlink(finalFilePath);

      return NextResponse.json({ success: true, message: 'File uploaded successfully' });
    }

    return NextResponse.json({ success: true, message: `Chunk ${chunkIndex} of ${fileName} received` });

  } catch (error) {
    console.error('Upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Upload failed', error: errorMessage }, { status: 500 });
  }
}