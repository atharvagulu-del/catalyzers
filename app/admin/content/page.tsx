'use client';

import { useState, useEffect } from 'react';
import { lectureData, Chapter, Resource } from '@/lib/lectureData';
import { Play, Plus, Trash2, Edit2, Save, X, Lock, Eye, EyeOff, Video, FileQuestion, BookOpen, CheckCircle2, Upload, ChevronDown, ChevronRight } from 'lucide-react';

interface ContentItem {
    id: string;
    resource_id?: string;
    chapter_id: string;
    subject: string;
    grade: string;
    exam_type: string;
    content_type: 'video' | 'quiz' | 'pyq' | 'article';
    title: string;
    youtube_url?: string;
    youtube_id?: string;
    duration?: string;
    questions?: Question[];
    sort_order: number;
    is_active: boolean;
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    hint?: string;
}

export default function AdminContentPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Selection state
    const [examType, setExamType] = useState<'JEE' | 'NEET'>('JEE');
    const [subject, setSubject] = useState('Mathematics');
    const [grade, setGrade] = useState('12');
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // Content state
    const [uploadedContent, setUploadedContent] = useState<Record<string, ContentItem>>({});
    const [loading, setLoading] = useState(false);
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

    // Form state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [contentType, setContentType] = useState<'video' | 'quiz'>('video');
    const [formData, setFormData] = useState({
        title: '',
        youtubeUrl: '',
        duration: '',
        questions: [] as Question[]
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Question form state
    const [currentQuestion, setCurrentQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        hint: ''
    });

    // Get chapters for current selection
    const getChapters = (): Chapter[] => {
        const key = `${examType.toLowerCase()}-${subject.toLowerCase()}-${grade}`;
        const data = lectureData[key];
        if (!data) return [];
        return data.units.flatMap(unit =>
            unit.chapters.filter(ch => !ch.title.toLowerCase().includes('full chapter test'))
        );
    };

    // Authenticate
    const handleLogin = () => {
        if (password === 'atharva@6971') {
            setIsAuthenticated(true);
            setAuthError('');
            localStorage.setItem('admin_auth', 'true');
        } else {
            setAuthError('Invalid password');
        }
    };

    // Check stored auth
    useEffect(() => {
        if (localStorage.getItem('admin_auth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch all uploaded content for current selection
    useEffect(() => {
        if (isAuthenticated) {
            fetchAllContent();
        }
    }, [isAuthenticated, subject, grade, examType]);

    const fetchAllContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/content?subject=${subject}&grade=${grade}&examType=${examType}&includeInactive=true`);
            const data = await res.json();
            const contentMap: Record<string, ContentItem> = {};
            (data.content || []).forEach((item: ContentItem) => {
                if (item.resource_id) {
                    contentMap[item.resource_id] = item;
                }
            });
            setUploadedContent(contentMap);
        } catch (err) {
            console.error('Failed to fetch content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Upload content for a resource
    const handleUpload = async () => {
        if (!selectedResource || !selectedChapter || !formData.title) {
            setMessage({ type: 'error', text: 'Please fill in required fields' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const existingContent = uploadedContent[selectedResource.id];
            const endpoint = '/api/admin/content';
            const method = existingContent ? 'PUT' : 'POST';
            const body = existingContent
                ? { id: existingContent.id, title: formData.title, youtubeUrl: formData.youtubeUrl, duration: formData.duration, questions: formData.questions }
                : {
                    resourceId: selectedResource.id,
                    chapterId: selectedChapter.id,
                    subject,
                    grade,
                    examType,
                    contentType,
                    ...formData
                };

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': 'atharva@6971'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: existingContent ? 'Content updated!' : 'Content uploaded!' });
                setShowUploadModal(false);
                setFormData({ title: '', youtubeUrl: '', duration: '', questions: [] });
                fetchAllContent();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload content' });
        } finally {
            setSaving(false);
        }
    };

    // Delete uploaded content
    const handleDelete = async (contentId: string) => {
        if (!confirm('Are you sure you want to delete this uploaded content?')) return;

        try {
            const res = await fetch(`/api/admin/content?id=${contentId}`, {
                method: 'DELETE',
                headers: { 'x-admin-password': 'atharva@6971' }
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Content deleted' });
                fetchAllContent();
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete' });
        }
    };

    // Toggle visibility
    const toggleVisibility = async (contentId: string, currentState: boolean) => {
        try {
            await fetch('/api/admin/content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': 'atharva@6971'
                },
                body: JSON.stringify({ id: contentId, is_active: !currentState })
            });
            fetchAllContent();
        } catch (err) {
            console.error('Failed to toggle visibility');
        }
    };

    // Open upload modal for a resource
    const openUploadModal = (chapter: Chapter, resource: Resource) => {
        setSelectedChapter(chapter);
        setSelectedResource(resource);
        setContentType(resource.type as 'video' | 'quiz');

        const existing = uploadedContent[resource.id];
        if (existing) {
            setFormData({
                title: existing.title,
                youtubeUrl: existing.youtube_url || '',
                duration: existing.duration || '',
                questions: existing.questions || []
            });
        } else {
            setFormData({
                title: resource.title,
                youtubeUrl: '',
                duration: resource.duration || '',
                questions: []
            });
        }

        setShowUploadModal(true);
    };

    // Add question to quiz
    const addQuestion = () => {
        if (!currentQuestion.text || currentQuestion.options.some(o => !o)) {
            setMessage({ type: 'error', text: 'Please fill all question fields' });
            return;
        }

        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            ...currentQuestion
        };

        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));

        setCurrentQuestion({
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            hint: ''
        });
    };

    // Remove question
    const removeQuestion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    // Extract YouTube ID for preview
    const getYouTubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Content Panel</h1>
                        <p className="text-gray-400 mt-2">Enter password to access</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {authError && <p className="text-red-400 text-sm">{authError}</p>}
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
                        >
                            Access Panel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const chapters = getChapters();

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Content Manager</h1>
                                <p className="text-sm text-gray-400">Upload videos & questions for all topics</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsAuthenticated(false); localStorage.removeItem('admin_auth'); }}
                            className="px-4 py-2 text-gray-400 hover:text-white transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
                    <h2 className="text-lg font-semibold mb-4">Select Content Scope</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Exam</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value as 'JEE' | 'NEET')}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="JEE">JEE</option>
                                <option value="NEET">NEET</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Subject</label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                {examType === 'NEET' && <option value="Biology">Biology</option>}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Grade</label>
                            <select
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 px-4 py-3 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {message.text}
                    </div>
                )}

                {/* Chapters & Topics List */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold mb-6">Chapters & Topics ({chapters.length} chapters)</h3>

                    {loading ? (
                        <div className="text-gray-400 py-8 text-center">Loading...</div>
                    ) : chapters.length === 0 ? (
                        <div className="text-gray-400 py-8 text-center">No chapters found for this selection</div>
                    ) : (
                        <div className="space-y-3">
                            {chapters.map((chapter) => {
                                const isExpanded = expandedChapter === chapter.id;
                                const uploadedCount = chapter.resources.filter(r => uploadedContent[r.id]).length;

                                return (
                                    <div key={chapter.id} className="border border-gray-800 rounded-xl overflow-hidden">
                                        {/* Chapter Header */}
                                        <button
                                            onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                <div className="text-left">
                                                    <h4 className="font-semibold">{chapter.title}</h4>
                                                    <p className="text-sm text-gray-400">{chapter.resources.length} topics</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {uploadedCount > 0 && (
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                                        {uploadedCount}/{chapter.resources.length} uploaded
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        {/* Topics/Resources */}
                                        {isExpanded && (
                                            <div className="bg-gray-850 p-4 space-y-2">
                                                {chapter.resources.map((resource) => {
                                                    const uploaded = uploadedContent[resource.id];
                                                    const isVideoType = resource.type === 'video';

                                                    return (
                                                        <div
                                                            key={resource.id}
                                                            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isVideoType ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                                    {isVideoType ? <Play className="w-4 h-4" /> : <FileQuestion className="w-4 h-4" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h5 className="text-sm font-medium">{resource.title}</h5>
                                                                    <p className="text-xs text-gray-500">{resource.type.toUpperCase()}</p>
                                                                </div>
                                                                {uploaded && (
                                                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {uploaded && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => toggleVisibility(uploaded.id, uploaded.is_active)}
                                                                            className="p-2 text-gray-400 hover:text-white transition"
                                                                            title={uploaded.is_active ? 'Hide' : 'Show'}
                                                                        >
                                                                            {uploaded.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(uploaded.id)}
                                                                            className="p-2 text-gray-400 hover:text-red-400 transition"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    onClick={() => openUploadModal(chapter, resource)}
                                                                    className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center gap-1"
                                                                >
                                                                    {uploaded ? <Edit2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                                                                    {uploaded ? 'Edit' : 'Upload'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && selectedResource && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {uploadedContent[selectedResource.id] ? 'Edit Content' : 'Upload Content'}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">{selectedResource.title}</p>
                            </div>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Video Form */}
                            {contentType === 'video' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Video Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g., Introduction to Calculus"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">YouTube URL *</label>
                                        <input
                                            type="text"
                                            value={formData.youtubeUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Duration (optional)</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="e.g., 15:30"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Video Preview */}
                                    {formData.youtubeUrl && getYouTubeId(formData.youtubeUrl) && (
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Preview</label>
                                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${getYouTubeId(formData.youtubeUrl)}`}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quiz Form */}
                            {(contentType === 'quiz' || selectedResource.type === 'pyq' || selectedResource.type === 'quiz') && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Quiz Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="e.g., PYQs: Thermodynamics"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Existing Questions */}
                                    {formData.questions.length > 0 && (
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Questions ({formData.questions.length})</label>
                                            <div className="space-y-2">
                                                {formData.questions.map((q, i) => (
                                                    <div key={q.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                                        <span className="text-sm truncate flex-1">{i + 1}. {q.text}</span>
                                                        <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-300 ml-2">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Question Form */}
                                    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
                                        <h4 className="font-medium">Add Question</h4>
                                        <textarea
                                            value={currentQuestion.text}
                                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                                            placeholder="Question text..."
                                            rows={2}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            {currentQuestion.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={currentQuestion.correctAnswer === i}
                                                        onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: i }))}
                                                        className="accent-orange-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOpts = [...currentQuestion.options];
                                                            newOpts[i] = e.target.value;
                                                            setCurrentQuestion(prev => ({ ...prev, options: newOpts }));
                                                        }}
                                                        placeholder={`Option ${i + 1}`}
                                                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <textarea
                                            value={currentQuestion.explanation}
                                            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                                            placeholder="Explanation (optional)"
                                            rows={2}
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <button
                                            onClick={addQuestion}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                                        >
                                            + Add Question
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleUpload}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>Saving...</>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {uploadedContent[selectedResource.id] ? 'Update' : 'Upload'}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
