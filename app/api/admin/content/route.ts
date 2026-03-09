import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin password - simple protection
const ADMIN_PASSWORD = 'atharva@6971';

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to extract YouTube ID from URL
function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Verify admin password
function verifyAdmin(request: NextRequest): boolean {
    const authHeader = request.headers.get('x-admin-password');
    return authHeader === ADMIN_PASSWORD;
}

// GET - Fetch content for a chapter
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get('chapterId');
        const subject = searchParams.get('subject');
        const grade = searchParams.get('grade');
        const examType = searchParams.get('examType') || 'JEE';
        const includeInactive = searchParams.get('includeInactive') === 'true';

        let query = supabaseAdmin
            .from('chapter_content')
            .select('*')
            .eq('exam_type', examType)
            .order('sort_order', { ascending: true });

        if (chapterId) query = query.eq('chapter_id', chapterId);
        if (subject) query = query.eq('subject', subject);
        if (grade) query = query.eq('grade', grade);
        if (!includeInactive) query = query.eq('is_active', true);

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ content: data || [] });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

// POST - Add new content
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { resourceId, chapterId, subject, grade, examType, contentType, title, youtubeUrl, duration, questions } = body;

        if (!chapterId || !subject || !grade || !contentType || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Extract YouTube ID if video
        const youtubeId = contentType === 'video' ? extractYouTubeId(youtubeUrl || '') : null;

        // Get max sort order
        const { data: maxOrder } = await supabaseAdmin
            .from('chapter_content')
            .select('sort_order')
            .eq('chapter_id', chapterId)
            .order('sort_order', { ascending: false })
            .limit(1)
            .single();

        const sortOrder = (maxOrder?.sort_order || 0) + 1;

        const { data, error } = await supabaseAdmin
            .from('chapter_content')
            .insert({
                resource_id: resourceId,
                chapter_id: chapterId,
                subject,
                grade,
                exam_type: examType || 'JEE',
                content_type: contentType,
                title,
                youtube_url: youtubeUrl,
                youtube_id: youtubeId,
                duration,
                questions: questions || [],
                sort_order: sortOrder,
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, content: data });
    } catch (error) {
        console.error('Error adding content:', error);
        return NextResponse.json({ error: 'Failed to add content' }, { status: 500 });
    }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
        }

        // If updating YouTube URL, extract ID
        if (updates.youtubeUrl) {
            updates.youtube_id = extractYouTubeId(updates.youtubeUrl);
            updates.youtube_url = updates.youtubeUrl;
            delete updates.youtubeUrl;
        }

        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('chapter_content')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, content: data });
    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}

// DELETE - Remove content
export async function DELETE(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('chapter_content')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting content:', error);
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
    }
}
