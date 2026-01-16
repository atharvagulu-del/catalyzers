import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';
import { Skeleton } from '@/components/Skeleton';
import Animated, { FadeIn, FadeInDown, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import {
  RefreshCw, Target, TrendingUp, Zap, Bell, User, CheckCircle2, Circle as CircleIcon, BookOpen
} from 'lucide-react-native';
import { ReviseIcon, CustomIcon, GrowIcon, FlashcardIcon, IdeaIcon } from '@/components/QuickActionsIcons';
import { getOrCreateDailyPlan, toggleGoalStatus, DailyGoal } from '@/lib/dailyGoals';
import { useAppColors } from '@/hooks/use-app-colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const quickActions = [
  { title: 'Revision\nFormula', icon: ReviseIcon, route: '/revision-formula' },
  { title: 'Custom\nPractice', icon: CustomIcon, route: null },
  { title: 'Improve', icon: GrowIcon, route: null },
  { title: 'Flash\nCards', icon: FlashcardIcon, route: null },
  { title: 'Explain it', icon: IdeaIcon, route: null },
];
export default function HomeScreen() {
  const { user, fullName } = useAuth();
  const colors = useAppColors();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<DailyGoal[]>([]);

  // Animated progress value
  const progress = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      const loadData = async () => {
        const fetchedGoals = await getOrCreateDailyPlan();
        setGoals(fetchedGoals);

        // Animate progress
        const completedCount = fetchedGoals.filter(g => g.completed).length;
        const progressPercent = fetchedGoals.length > 0
          ? (completedCount / fetchedGoals.length) * 100
          : 0;

        progress.value = withTiming(progressPercent, {
          duration: 1200,
          easing: Easing.out(Easing.cubic)
        });

        setIsLoading(false);
      };
      loadData();
    }, [])
  );

  const handleToggleGoal = async (goal: DailyGoal) => {
    if (goal.isAutomated) return; // Can't manually toggle automated goals

    const newStatus = !goal.completed;
    const updatedGoals = await toggleGoalStatus(goal.id, newStatus);
    setGoals(updatedGoals);

    // Update progress animation
    const completedCount = updatedGoals.filter(g => g.completed).length;
    const progressPercent = updatedGoals.length > 0
      ? (completedCount / updatedGoals.length) * 100
      : 0;

    progress.value = withTiming(progressPercent, {
      duration: 600,
      easing: Easing.out(Easing.cubic)
    });
  };

  // Quick Action Button Component
  const QuickActionButton = ({ action, Icon, index }: { action: any, Icon: any, index: number }) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const handlePressIn = () => {
      scale.value = withTiming(0.92, { duration: 100 });
      translateY.value = withTiming(4, { duration: 100 });
    };

    const handlePressOut = () => {
      scale.value = withTiming(1, { duration: 150 });
      translateY.value = withTiming(0, { duration: 150 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    }));

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        style={{ alignItems: 'center', width: 80 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            handlePressOut();
            action.route && router.push(action.route);
          }}
          style={{ alignItems: 'center', width: 80 }}
        >
          <Animated.View
            style={[
              { position: 'relative', marginBottom: 8 },
              animatedStyle
            ]}
          >
            <View style={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: colors.shadowBg,
              borderRadius: 20,
            }} />

            <View style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: colors.cardBg, // Use card background like website
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1, // Softer shadow like website
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Icon width={48} height={48} />
            </View>
          </Animated.View>

          <Text style={{
            fontSize: 11,
            fontWeight: '500',
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 14,
          }}>
            {action.title.replace('\n', ' ')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;
  const progressColor = progressPercent === 100 ? '#22c55e' : '#3B82F6';

  // SVG Circle params
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference,
  }));

  const displayName = fullName || user?.email?.split('@')[0] || 'Student';

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20 }}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.bg} />
        <View style={{ paddingTop: 50 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            <View style={{ gap: 8 }}>
              <Skeleton width={200} height={20} borderRadius={4} />
              <Skeleton width={100} height={16} borderRadius={4} />
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Skeleton width={24} height={24} borderRadius={12} />
              <Skeleton width={24} height={24} borderRadius={12} />
            </View>
          </View>
          <Skeleton width={120} height={24} borderRadius={4} />
          <View style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} width={55} height={80} borderRadius={18} />
            ))}
          </View>
          <View style={{ marginTop: 40, gap: 16 }}>
            <Skeleton width={100} height={24} borderRadius={4} />
            <Skeleton width="100%" height={200} borderRadius={16} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.bg} />
        {/* Header */}
        <View style={{ paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Welcome back, {displayName}</Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>Your target: <Text style={{ color: colors.primary, fontWeight: '600' }}>JEE</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity><Bell size={24} color={colors.text} /></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}><User size={24} color={colors.text} /></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions - Allen Style */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <QuickActionButton
                  key={index}
                  action={action}
                  Icon={Icon}
                  index={index}
                />
              );
            })}
          </View>
        </View>


        {/* Daily Goals */}
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <View style={{ backgroundColor: colors.cardBg, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Daily Goals</Text>
                {progressPercent === 100 && <Text style={{ fontSize: 11, color: colors.success, marginTop: 2 }}>🎉 All done!</Text>}
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{completedCount}/{goals.length} Done</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Animated Progress Ring */}
              <View style={{ width: size, height: size, marginRight: 20 }}>
                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                  {/* Background Circle */}
                  <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.border}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Animated Progress Circle */}
                  <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                  />
                </Svg>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: progressPercent === 100 ? colors.success : colors.text }}>{progressPercent}%</Text>
                  <Text style={{ fontSize: 10, color: colors.textTertiary, textTransform: 'uppercase', fontWeight: '600' }}>Done</Text>
                </View>
              </View>

              {/* Goals List */}
              <View style={{ flex: 1, gap: 10 }}>
                {goals.map((goal, index) => (
                  <TouchableOpacity
                    key={goal.id}
                    onPress={() => handleToggleGoal(goal)}
                    disabled={goal.isAutomated}
                    style={{ flexDirection: 'row', alignItems: 'center', opacity: goal.completed ? 0.6 : 1 }}
                  >
                    {goal.completed ? (
                      <CheckCircle2 size={18} color={colors.success} style={{ marginRight: 10 }} />
                    ) : (
                      <CircleIcon size={18} color={colors.textTertiary} style={{ marginRight: 10 }} />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: goal.completed ? colors.textTertiary : colors.text,
                        fontSize: 13,
                        textDecorationLine: goal.completed ? 'line-through' : 'none',
                        fontWeight: '600'
                      }}>
                        {goal.title}
                      </Text>
                      {goal.isAutomated && !goal.completed && (
                        <Text style={{ color: colors.textTertiary, fontSize: 10, marginTop: 2 }}>Auto-tracked</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Your tests - Allen Style */}
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }}>Your tests</Text>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            {['Upcoming', 'Past Tests', 'Missed Tests'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  backgroundColor: activeTab === tab ? colors.text : colors.iconBg,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20
                }}
              >
                <Text style={{
                  color: activeTab === tab ? (colors.isDark ? '#000' : '#FFF') : colors.textSecondary,
                  fontWeight: '600',
                  fontSize: 13
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Empty State - Allen Style */}
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
            paddingHorizontal: 20
          }}>
            {/* Illustration */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 80 }}>📝</Text>
            </View>

            {/* Text */}
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 8
            }}>
              You have no upcoming tests
            </Text>
            <Text style={{
              fontSize: 14,
              color: colors.textTertiary,
              textAlign: 'center',
              lineHeight: 20
            }}>
              Tests will appear once admin schedules them
            </Text>
          </View>
        </View>

      </ScrollView>
    </Animated.View>
  );
}
