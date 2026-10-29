'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Calendar, 
  Search, 
  LayoutGrid, 
  List
} from 'lucide-react';
import { TrackedApplication, getClientApplications, saveClientApplication, deleteClientApplication } from '@/lib/applications/store';

export const ApplicationTrackerView: React.FC = () => {
  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    setApplications(getClientApplications());
  }, []);

  const handleUpdateStatus = (app: TrackedApplication, newStatus: TrackedApplication['status']) => {
    const updated = saveClientApplication({ ...app, status: newStatus });
    setApplications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteClientApplication(id);
    setApplications(updated);
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: { key: TrackedApplication['status']; label: string; color: string }[] = [
    { key: 'draft', label: 'Drafted', color: 'border-slate-200 text-slate-700' },
    { key: 'applied', label: 'Applied', color: 'border-blue-200 text-blue-700' },
    { key: 'interviewing', label: 'Interviewing', color: 'border-purple-200 text-purple-700' },
    { key: 'offer', label: 'Offer Received', color: 'border-emerald-200 text-emerald-700' },
    { key: 'rejected', label: 'Archived', color: 'border-slate-200 text-slate-400' },
  ];

  const total = applications.length;
  const activePipeline = applications.filter(a => a.status === 'applied' || a.status === 'interviewing').length;
  const interviews = applications.filter(a => a.status === 'interviewing').length;
  const offers = applications.filter(a => a.status === 'offer').length;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Application Lifecycle Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Job Application Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Track application submissions, interview milestones, and follow-up deadlines.
          </p>
        </div>

        <Link
          href="/applications"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tailor & Add Application</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Tracked</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{total}</div>
          <div className="text-xs text-slate-400 mt-1">Recorded submissions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Active Pipeline</div>
          <div className="text-2xl font-bold text-blue-600 font-mono">{activePipeline}</div>
          <div className="text-xs text-slate-400 mt-1">Applied & in-progress</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Interviews</div>
          <div className="text-2xl font-bold text-purple-600 font-mono">{interviews}</div>
          <div className="text-xs text-slate-400 mt-1">Scheduled or completed</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">Offers</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">{offers}</div>
          <div className="text-xs text-slate-400 mt-1">Offers on table</div>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl self-end shadow-xs">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              viewMode === 'kanban' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>
      </div>

      {/* Main View: List or Kanban */}
      {filteredApps.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <CheckSquare className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Applications Recorded</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {applications.length === 0
              ? 'You have not added any application records yet. Tailor your resume for a target job in the Application Studio to start tracking.'
              : 'No applications match your search query.'}
          </p>
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs mt-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Application</span>
          </Link>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Follow-Up Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{app.company}</div>
                      <div className="text-slate-500 text-xs">{app.roleTitle}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app, e.target.value as TrackedApplication['status'])}
                        className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs capitalize"
                      >
                        <option value="draft">Draft</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {app.followUpDate || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colApps = filteredApps.filter(a => a.status === col.key);
            return (
              <div key={col.key} className="space-y-3 min-w-[200px]">
                <div className={`p-2.5 rounded-xl bg-slate-50 border ${col.color} flex items-center justify-between`}>
                  <span className="text-xs font-bold">{col.label}</span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full text-slate-600 border border-slate-200">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[300px]">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all space-y-2 shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-xs text-slate-900">{app.company}</div>
                        <span className="text-[10px] font-bold text-emerald-700 font-mono">
                          {app.matchScore}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{app.roleTitle}</div>
                      {app.followUpDate && (
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{app.followUpDate}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app, e.target.value as TrackedApplication['status'])}
                          className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded px-1.5 py-0.5 capitalize"
                        >
                          <option value="draft">Draft</option>
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offer">Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
