import { unlink, writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const METADATA_FILE = path.join(UPLOADS_DIR, '.metadata.json');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type FileMetadata = {
  [filename: string]: {
    category?: 'reference' | 'general';
    uploadedAt: string;
  };
};

async function loadMetadata(): Promise<FileMetadata> {
  try {
    const data = await readFile(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveMetadata(metadata: FileMetadata): Promise<void> {
  try {
    await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
  } catch {
    // silently ignore
  }
}

export async function GET() {
  try {
    const files = await readdir(UPLOADS_DIR);
    const images = files.filter((f) => f !== '.gitkeep' && f !== '.metadata.json' && /\.(jpe?g|png|webp|gif)$/i.test(f));
    const metadata = await loadMetadata();
    
    const filesWithMetadata = images.map(filename => ({
      filename,
      category: metadata[filename]?.category || 'general',
      uploadedAt: metadata[filename]?.uploadedAt || new Date().toISOString()
    }));
    
    return NextResponse.json({ files: filesWithMetadata });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category') as 'reference' | 'general' || 'general';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 400 });
    }

    // Sanitise filename
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const base = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    const filename = `${base}-${Date.now()}.${ext}`;
    const dest = path.join(UPLOADS_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(dest, buffer);

    // Update metadata
    const metadata = await loadMetadata();
    metadata[filename] = {
      category,
      uploadedAt: new Date().toISOString()
    };
    await saveMetadata(metadata);

    return NextResponse.json({ filename, url: `/uploads/${filename}`, category });
  } catch {
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { filename } = (await request.json()) as { filename?: string };

    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 });
    }

    const target = path.join(UPLOADS_DIR, filename);
    await unlink(target);

    // Update metadata
    const metadata = await loadMetadata();
    delete metadata[filename];
    await saveMetadata(metadata);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
