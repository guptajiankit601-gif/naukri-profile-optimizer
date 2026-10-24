import React from 'react';
import { ScoreHistoryPoint } from '@/types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Award, Calendar, ArrowUpRight } from 'lucide-react';

interface ProgressTrackerViewProps {
  scoreHistory: ScoreHistoryPoint[];
  currentScore: number;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({ scoreHistory, currentScore }) => {
  const initialScore = scoreHistory[0]?.score || currentScore;
  const delta = currentScore - initialScore;

  const chartData = scoreHistory.map((item, idx) => ({
    name: idx === 0 ? 'Initial Intake' : `Iteration ${idx}`,
    score: item.score,
    reason: item.changeReason
  }));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#13273A] p-5 rounded-2xl border border-[#234566] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FF7582]" />
            <span>Before / After Optimization Progress Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track your profile's recruiter visibility gains in real-time as you refine keywords and impact statements.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F2233] border border-[#234566]">
          <span className="text-xs text-slate-400">Total Improvement:</span>
          <span className={`text-sm font-black flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <ArrowUpRight className="w-4 h-4" />
            +{Math.max(0, delta)} Points
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#13273A] border border-[#234566] shadow-md">
          <div className="text-xs text-slate-400 font-semibold mb-1">Starting Baseline Score</div>
          <div className="text-3xl font-black text-slate-300">{initialScore}/100</div>
          <div className="text-[10px] text-slate-500 mt-1">Pre-optimization intake</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#13273A] border border-[#234566] shadow-md">
          <div className="text-xs text-slate-400 font-semibold mb-1">Current Optimized Score</div>
          <div className={`text-3xl font-black ${currentScore >= 71 ? 'text-emerald-400' : currentScore >= 41 ? 'text-amber-400' : 'text-[#FF7582]'}`}>
            {currentScore}/100
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Status: {currentScore >= 71 ? 'Strong' : currentScore >= 41 ? 'Okay' : 'Needs Work'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#18314A] to-[#725A7A]/30 border border-[#FF7582]/30 shadow-md">
          <div className="text-xs text-[#FF7582] font-semibold mb-1">Estimated Recruiter Outreach</div>
          <div className="text-3xl font-black text-white">
            {currentScore >= 75 ? '8 - 14' : currentScore >= 50 ? '3 - 6' : '0 - 1'}
          </div>
          <div className="text-[10px] text-slate-300 mt-1">Expected calls & screens / month</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Profile Strength Score Over Iterations
          </h4>
          <span className="text-[11px] text-slate-400">{scoreHistory.length} checkpoints recorded</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#234566" opacity={0.5} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F2233', borderColor: '#234566', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any, _name: any, item: any) => [`${val}/100`, item.payload.reason]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#FF7582"
                strokeWidth={3}
                dot={{ r: 5, fill: '#FF7582', strokeWidth: 2, stroke: '#0F2233' }}
                activeDot={{ r: 8, fill: '#C56C86' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-[#13273A] rounded-2xl border border-[#234566] p-5 shadow-xl space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
          Change History Log:
        </div>
        <div className="space-y-2">
          {scoreHistory.map((pt, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0F2233] border border-[#234566] text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF7582]" />
                <span className="text-slate-200 font-medium">{pt.changeReason}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px]">{pt.date}</span>
                <span className="font-extrabold text-[#FF7582]">{pt.score} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
