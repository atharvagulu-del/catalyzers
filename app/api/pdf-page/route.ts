import { NextRequest, NextResponse } from 'next/server';
import { pdf } from 'pdf-to-img';
import path from 'path';
import fs from 'fs';

// Cache for converted pages to avoid re-conversion
const pageCache = new Map<number, Buffer>();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pageNum = parseInt(searchParams.get('page') || '1', 10);

    // Validate page number
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 100) {
        return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }

    try {
        // Check cache first
        if (pageCache.has(pageNum)) {
            return new NextResponse(pageCache.get(pageNum), {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                },
            });
        }

        // Path to PDF file
        const pdfPath = path.join(process.cwd(), 'public', 'assets', 'documents', 'formula-booklet.pdf');

        // Check if file exists
        if (!fs.existsSync(pdfPath)) {
            return NextResponse.json({ error: 'PDF file not found' }, { status: 404 });
        }

        // Convert specific page to image
        const document = await pdf(pdfPath, { scale: 2.0 }); // Higher scale for better quality

        let currentPage = 0;
        let imageBuffer: Buffer | null = null;

        for await (const image of document) {
            currentPage++;
            if (currentPage === pageNum) {
                imageBuffer = Buffer.from(image);
                break;
            }
        }

        if (!imageBuffer) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Cache the result
        pageCache.set(pageNum, imageBuffer);

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('PDF conversion error:', error);
        return NextResponse.json({ error: 'Failed to convert PDF page' }, { status: 500 });
    }
}
