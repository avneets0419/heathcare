import { Activity, Download, ArrowUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hospital Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track key metrics, patient footfall, and generate reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 transition-all">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button className="bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Main Widget: Revenue (Takes 2 cols, standout color) */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 dark:from-emerald-600 dark:to-teal-900 p-6 rounded-3xl flex flex-col justify-between text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-1 duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h3 className="font-medium text-emerald-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Total Revenue
            </h3>
            <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-md">
              This Month
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-5xl font-extrabold mb-2 tracking-tight">$84,520</p>
            <div className="flex items-center text-sm font-medium text-emerald-300">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>+12.5% vs last month</span>
            </div>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-500 dark:text-slate-400">
              Total Patients
            </h3>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-sky-500" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">1,234</p>
            <div className="flex items-center text-sm font-medium text-emerald-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>+4% this week</span>
            </div>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-500 dark:text-slate-400">
              Active Doctors
            </h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">45</p>
            <div className="flex items-center text-sm font-medium text-emerald-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>+3 new this week</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Patient Footfall</h3>
            <select className="text-sm border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-300 rounded-lg focus:ring-primary focus:border-primary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          {/* Mock Chart Area */}
          <div className="flex-1 flex items-end gap-2 justify-between mt-auto pt-8">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full relative bg-slate-100 dark:bg-slate-700/50 rounded-t-xl h-48 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-t-sm group-hover:bg-emerald-400 dark:group-hover:bg-emerald-300 transition-all duration-500 relative"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs py-1 px-2 rounded-md whitespace-nowrap transition-opacity shadow-lg shadow-black/10 z-10 font-medium">
                      {h * 12} pts
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Appointments</h3>
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">View All</Button>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, name: "Aarav Sharma", type: "General Checkup", time: "10:00 AM", status: "Confirmed", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300" },
              { id: 2, name: "Priya Nair", type: "Cardiology", time: "11:30 AM", status: "Pending", color: "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300" },
              { id: 3, name: "Rohan Mehta", type: "Dental", time: "01:15 PM", status: "Confirmed", color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300" },
              { id: 4, name: "Neha Gupta", type: "Neurology", time: "03:00 PM", status: "Cancelled", color: "text-rose-700 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300" },
            ].map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shadow-sm">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{patient.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      {patient.type}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{patient.time}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${patient.color}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
