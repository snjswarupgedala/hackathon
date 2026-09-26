import React from 'react';
import { OverviewCards } from './OverviewCards';
import { TodayPlanCard } from './TodayPlanCard';
import { UpcomingDeadlinesCard } from './UpcomingDeadlinesCard';
import { AIRecommendationCard } from './AIRecommendationCard';
import { GamificationWidget } from './GamificationWidget';

export const MainDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top 6 Overview Metric Cards */}
      <OverviewCards />

      {/* Hero AI Recommendation Card */}
      <AIRecommendationCard />

      {/* Today's Action Plan & Upcoming Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayPlanCard />
        <UpcomingDeadlinesCard />
      </div>

      {/* Gamification & Badges Widget */}
      <GamificationWidget />
    </div>
  );
};
