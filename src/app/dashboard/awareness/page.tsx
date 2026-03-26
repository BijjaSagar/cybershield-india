"use client";

import { useState, useEffect, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, RefreshCw, Plus, X } from "lucide-react";

interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  language: string;
  completed: number;
  total: number;
  completionRate: number;
}

interface Employee {
  email: string;
  name: string;
  completedModules: number;
  totalModules: number;
  avgScore: number;
}

interface AwarenessData {
  modules: TrainingModule[];
  employees: Employee[];
  completionRate: number;
  highRisk: number;
  totalEmployees: number;
}

const TRAINING_MODULES = [
  { id: "TM-01", title: "Phishing Recognition" },
  { id: "TM-02", title: "Password Security & MFA" },
  { id: "TM-03", title: "WhatsApp Scam Detection" },
  { id: "TM-04", title: "USB & Physical Security" },
  { id: "TM-05", title: "Social Engineering Awareness" },
];

export default function AwarenessPage() {
  const [data, setData] = useState<AwarenessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeEmail: "", employeeName: "", moduleId: "TM-01",
    completed: false, score: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/awareness");
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error("Failed to fetch awareness data", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function addRecord(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/awareness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        score: form.score ? parseInt(form.score) : null,
      }),
    });
    setShowAdd(false);
    setForm({ employeeEmail: "", employeeName: "", moduleId: "TM-01", completed: false, score: "" });
    await fetchData();
    setSaving(false);
  }

  const completionRate = data?.completionRate ?? 0;
  const highRisk = data?.highRisk ?? 0;
  const employees = data?.employees ?? [];
  const modules = data?.modules ?? [];

  return (
    <div>
      <Topbar
        title="Security Awareness Training"
        subtitle="Phishing simulations · Hindi + English · Employee security scores"
      />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-white">{loading ? "—" : `${completionRate}%`}</div>
              <div className="text-xs text-slate-400 mt-1">Training Completion</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className={`text-2xl font-bold ${highRisk > 0 ? "text-orange-400" : "text-emerald-400"}`}>
                {loading ? "—" : highRisk}
              </div>
              <div className="text-xs text-slate-400 mt-1">High-Risk Employees</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{loading ? "—" : data?.totalEmployees ?? 0}</div>
              <div className="text-xs text-slate-400 mt-1">Employees Tracked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{TRAINING_MODULES.length}</div>
              <div className="text-xs text-slate-400 mt-1">Modules Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Training Record modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">Add Training Record</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={addRecord} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Employee Name *</label>
                  <input required value={form.employeeName} onChange={e => setForm(f => ({ ...f, employeeName: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Employee Email *</label>
                  <input required type="email" value={form.employeeEmail} onChange={e => setForm(f => ({ ...f, employeeEmail: e.target.value }))}
                    placeholder="rahul@yourcompany.com"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Training Module *</label>
                  <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50">
                    {TRAINING_MODULES.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="completed" checked={form.completed} onChange={e => setForm(f => ({ ...f, completed: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600" />
                  <label htmlFor="completed" className="text-sm text-slate-300">Mark as Completed</label>
                </div>
                {form.completed && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Score (0-100)</label>
                    <input type="number" min="0" max="100" value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                      placeholder="85"
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50" />
                  </div>
                )}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-400 text-sm hover:text-white transition-all">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50">
                    {saving ? "Saving..." : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Training Modules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" /> Training Modules
                </h2>
                <button onClick={fetchData} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                  <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {TRAINING_MODULES.map(mod => {
                const modData = modules.find(m => m.id === mod.id);
                return (
                  <div key={mod.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{mod.title}</div>
                        {modData && modData.total > 0 ? (
                          <>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${modData.completionRate}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{modData.completed}/{modData.total} ({modData.completionRate}%)</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-600 mt-1">No employees enrolled yet</div>
                        )}
                      </div>
                      <button
                        onClick={() => { setForm(f => ({ ...f, moduleId: mod.id })); setShowAdd(true); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/30 transition-all flex-shrink-0">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Employee Scores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Employee Security Scores
                </h2>
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs border border-blue-500/20 hover:bg-blue-600/30 transition-all">
                  <Plus className="w-3 h-3" /> Add Employee
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {loading ? (
                <div className="text-center py-6 text-slate-500 text-sm">Loading...</div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <div className="text-sm">No employees enrolled yet</div>
                  <div className="text-xs text-slate-500 mt-1">Click "Add Employee" to enrol employees in training modules</div>
                </div>
              ) : (
                employees.map(emp => (
                  <div key={emp.email} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-semibold text-blue-400 flex-shrink-0">
                      {emp.name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{emp.name}</div>
                      <div className="text-xs text-slate-500">{emp.email} · {emp.completedModules}/{emp.totalModules} modules</div>
                    </div>
                    <div className={`text-sm font-bold ${
                      emp.avgScore >= 80 ? "text-emerald-400" :
                      emp.avgScore >= 60 ? "text-yellow-400" :
                      emp.avgScore === 0 ? "text-slate-500" : "text-red-400"
                    }`}>
                      {emp.avgScore === 0 && emp.completedModules === 0 ? "N/A" : `${emp.avgScore}`}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
