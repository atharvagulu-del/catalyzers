import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Trophy, PlayCircle, BarChart3, Timer, BookOpen, ChevronRight } from 'lucide-react-native';
import { useAppColors } from '@/hooks/use-app-colors';
import { TestWithResults, getTestStatus, TestStatus } from '@/lib/offlineTests';

interface TestCardProps {
    test: TestWithResults;
    onPress: () => void;
    onViewSyllabus?: () => void;
    onViewResult?: () => void;
}

export default function TestCard({ test, onPress, onViewSyllabus, onViewResult }: TestCardProps) {
    const colors = useAppColors();
    const status = getTestStatus(test);

    const now = new Date();
    const start = new Date(test.start_time);
    const end = new Date(test.end_time);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    const hasScore = test.my_result?.marks_obtained !== null && test.my_result?.marks_obtained !== undefined;

    // Status-based styling
    const getStatusConfig = (status: TestStatus) => {
        switch (status) {
            case 'live':
                return {
                    label: 'Live Now',
                    bgColor: '#EF4444',
                    textColor: '#FFFFFF',
                    icon: <PlayCircle size={14} color="#FFFFFF" />,
                    borderColor: '#FCA5A5',
                };
            case 'results_out':
                return {
                    label: 'Results Out',
                    bgColor: '#10B981',
                    textColor: '#FFFFFF',
                    icon: <Trophy size={14} color="#FFFFFF" />,
                    borderColor: '#6EE7B7',
                };
            case 'ended':
                return {
                    label: 'Awaiting Results',
                    bgColor: '#F59E0B',
                    textColor: '#FFFFFF',
                    icon: <Timer size={14} color="#FFFFFF" />,
                    borderColor: '#FCD34D',
                };
            default:
                return {
                    label: 'Upcoming',
                    bgColor: '#3B82F6',
                    textColor: '#FFFFFF',
                    icon: <Clock size={14} color="#FFFFFF" />,
                    borderColor: '#93C5FD',
                };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                backgroundColor: colors.cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: 'hidden',
                marginBottom: 12,
            }}
        >
            {/* Status Header */}
            <View style={{
                backgroundColor: statusConfig.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
            }}>
                {status === 'live' && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }} />
                )}
                {statusConfig.icon}
                <Text style={{ fontSize: 11, fontWeight: '700', color: statusConfig.textColor, letterSpacing: 0.5 }}>
                    {statusConfig.label.toUpperCase()}
                </Text>
            </View>

            {/* Card Content */}
            <View style={{ padding: 16 }}>
                {/* Title Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }} numberOfLines={1}>
                            {test.test_name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <View style={{ backgroundColor: colors.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{test.subject}</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>{test.max_marks} marks</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                            {new Date(test.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>Class {test.class}</Text>
                    </View>
                </View>

                {/* Meta Info */}
                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Calendar size={14} color={colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                            {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} color={colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                            {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Timer size={14} color={colors.textSecondary} />
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{durationMinutes} mins</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* View Syllabus Button */}
                    {test.chapters && test.chapters.length > 0 && onViewSyllabus && (
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onViewSyllabus();
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                backgroundColor: colors.bg,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <BookOpen size={14} color={colors.textSecondary} />
                            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}>View Syllabus</Text>
                        </TouchableOpacity>
                    )}

                    {/* View Result Button - Only for results_out status */}
                    {status === 'results_out' && hasScore && (
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                if (onViewResult) onViewResult();
                                else onPress();
                            }}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                backgroundColor: '#10B981',
                                borderRadius: 8,
                            }}
                        >
                            <BarChart3 size={14} color="#FFFFFF" />
                            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>View Result</Text>
                            <ChevronRight size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    {/* Live test - shows end time */}
                    {status === 'live' && (
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                Ends at {end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

