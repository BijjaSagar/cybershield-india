"use client";

import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, Mail, Trophy, Play, CheckCircle2 } from "lucide-react";

const employees = [
  { name: "Akash Sharma", role: "Admin", score: 92, trainings: 3, lastPhish: "Passed", status: "low-risk" },
  { name: "Priya Patel", role: "Finance", score: 78, trainings: 2, lastPhish: "Passed", status: "medium-risk" },
  { name: "Rohit Kumar", role: "Sales", score: 45, trainings: 1, lastPhish: "Clicked", status: "high-risk" },
  { name: "Sneha Joshi", role: "Operations", score: 88, trainings: 3, lastPhish: "Passed", status: "low-risk" },
  { name: "Amit Singh", role: "IT Support", score: 95, trainings: 3, lastPhish: "Passed", status: "low-risk" },
  { name: "Deepa Nair", role: "HR", score: 62, trainings: 2, lastPhish: "Passed", status: "medium-risk" },
];

const modules = [
  { title: "Phishing Recognition", duration: "10 min", language: "Hindi + English", completed: 8, total: 10, type: "video" },
  { title: "Password Security & MFA", duration: "8 min", language: "Hindi + English", completed: 7, total: 10, type: "video" },
  { title: "WhatsApp Scam Detection", duration: "12 min", language: "Hindi", completed: 5, total: 10, type: "video" },
  { title: "USB & Physical Security", duration: "6 min", language: "English", completed: 9, total: 10, type: "video" },
  { title: "Social Engineering Awareness", duration: "10 min", language: "Hindi + English", completed: 4, total: 10, type: "interactive" },
];

export default function AwarenessPage() {
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
              <div className="text-2xl font-bold text-white">65%</div>
              <div className="text-xs text-slate-400 mt-1">Training Completion</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-orange-400">1</div>
              <div className="text-xs text-slate-400 mt-1">High-Risk Employees</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">83%</div>
              <div className="text-xs text-slate-400 mt-1">Phishing Pass Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-blue-400">5</div>
              <div className="text-xs text-slate-400 mt-1">Modules Available</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Training modules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Training Modules
                </h2>
                <button className="text-xs text-blue-400 hover:text-blue-300">Assign All →</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {modules.map((mod) => (
                <div key={mod.title} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{mod.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{mod.duration} · {mod.language}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(mod.completed / mod.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{mod.completed}/{mod.total}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs hover:bg-blue-600/30 transition-all flex-shrink-0">
                      <Play className="w-3 h-3" />
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Employee scores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Employee Security Scores
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-xs border border-orange-500/20 hover:bg-orange-500/30 transition-all">
                  <Mail className="w-3 h-3" />
                  Send Phishing Test
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {employees.map((emp) => (
                <div key={emp.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-semibold text-blue-400 flex-shrink-0">
                    {emp.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{emp.name}</div>
                    <div className="text-xs text-slate-500">{emp.role} · {emp.trainings}/3 modules</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      emp.lastPhish === "Clicked"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {emp.lastPhish === "Clicked" ? "⚠ Clicked" : "✓ Passed"}
                    </span>
                    <div className={`text-sm font-bold ${
                      emp.score >= 80 ? "text-emerald-400" :
                      emp.score >= 60 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {emp.score}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
