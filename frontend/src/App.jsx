import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, GraduationCap, LayoutDashboard, Settings, TrendingUp, ShieldCheck, Database, Loader2, Wallet, Plus, Save, UserCheck, Zap, AlertTriangle, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { connectWallet, getContract, formatAddress, fetchAllRecords } from './utils/ethereum';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64 glass-panel h-screen fixed left-0 top-0 flex flex-col p-6 z-10 transition-transform duration-300">
    <div className="flex items-center gap-3 mb-10 text-cyan-400 group cursor-pointer">
      <GraduationCap size={32} className="group-hover:rotate-12 transition-transform" />
      <h1 className="text-xl font-bold tracking-wider">EduChain AI</h1>
    </div>

    <nav className="space-y-4 flex-1">
      {[
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'prediction', icon: TrendingUp, label: 'Performance AI' },
        { id: 'records', icon: Database, label: 'Blockchain Data' },
        { id: 'teacher', icon: BookOpen, label: 'Teacher Portal' }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 relative group ${activeTab === item.id
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
          <span className="font-medium">{item.label}</span>
          {activeTab === item.id && (
            <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full" />
          )}
        </button>
      ))}
    </nav>

    <div className="mt-auto pt-6 border-t border-white/10">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>V4 Protection Active</span>
      </div>
    </div>
  </div>
);

const RecordsExplorer = ({ wallet }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet) load();
  }, [wallet]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRecords(wallet.signer);
      setRecords(data);
    } catch (e) {
      console.error("Load failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white mb-2">Blockchain Records</h2>
        <button onClick={load} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20">
          <Activity size={16} /> Refresh Chain
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
          <Loader2 className="animate-spin text-cyan-400" size={40} />
          <p>Syncing with Local Blockchain Node...</p>
        </div>
      ) : records.length > 0 ? (
        <div className="grid gap-4 pb-20">
          {records.map((r, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className="glass-card p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-cyan-500 group hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[10px] text-slate-500 font-bold">ID</span>
                  <span className="text-cyan-400 font-mono font-bold leading-none">{r.studentId}</span>
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-2">
                    {r.subject}
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">{r.semester}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {r.timestamp}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500 italic">"{r.remarks || 'No remarks provided'}"</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white font-mono">{r.score}<span className="text-sm text-slate-500 font-normal ml-0.5">/100</span></div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${Number(r.score) > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                  VERIFIED
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 rounded-2xl border-dashed border-slate-700 text-center flex flex-col items-center gap-4">
          <Database size={48} className="text-slate-600" />
          <div>
            <p className="text-white font-medium">No Records Found</p>
            <p className="text-slate-400 text-sm">Upload records using the Teacher Portal to see them here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const TeacherPortal = ({ wallet }) => {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!wallet) {
      setStatus({ type: 'error', msg: 'Please connect wallet first' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const contract = await getContract(wallet.signer);
      const tx = await contract.addRecord(studentId, "Spring 2025", subject, score, "Academic Validation Complete");
      await tx.wait();
      setStatus({ type: 'success', msg: `Immutable record saved! Transaction: ${tx.hash.slice(0, 10)}...` });
      setStudentId(''); setSubject(''); setScore('');
    } catch (e) {
      console.error(e);
      setStatus({ type: 'error', msg: 'Transaction failed via Metamask' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
          <BookOpen size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Teacher Portal</h2>
          <p className="text-slate-400 text-sm">Deploy tamper-proof academic records to the blockchain.</p>
        </div>
      </div>

      <div className="glass-card p-10 rounded-2xl border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

        <h3 className="text-xl font-semibold text-white mb-8 border-b border-white/5 pb-4">Record New Entry</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student ID (Numeric)</label>
              <input value={studentId} onChange={e => setStudentId(e.target.value)} type="number" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 transition-all outline-none" placeholder="e.g. 1001" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Score</label>
              <input value={score} onChange={e => setScore(e.target.value)} type="number" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 transition-all outline-none" placeholder="0-100" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Name</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:border-purple-500 transition-all outline-none" placeholder="e.g. Computer Science II" />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-5 rounded-2xl mt-4 flex justify-center items-center gap-3 transition-all shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
            Deploy to Mainnet-Local
          </button>

          <AnimatePresence>
            {status && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`p-4 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {status.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const PerformanceChart = () => {
  const data = [
    { name: 'Sem 1', gpa: 3.2, attendance: 90 },
    { name: 'Sem 2', gpa: 3.4, attendance: 88 },
    { name: 'Sem 3', gpa: 3.5, attendance: 92 },
    { name: 'Sem 4', gpa: 3.3, attendance: 85 },
    { name: 'Sem 5', gpa: 3.8, attendance: 95 },
    { name: 'Sem 6', gpa: 3.9, attendance: 96 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
        <TrendingUp size={20} className="text-cyan-400" /> Performance Evolution
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="gpa" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StudentPersona = ({ score }) => {
  const getPersona = () => {
    if (score >= 90) return { label: 'Elite Visionary', color: 'text-cyan-400', icon: Zap, bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' };
    if (score >= 75) return { label: 'Consistent Achiever', color: 'text-blue-400', icon: UserCheck, bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' };
    return { label: 'Resilient Booster', color: 'text-amber-400', icon: AlertTriangle, bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' };
  };
  const p = getPersona();
  const Icon = p.icon;
  return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`${p.bg} ${p.color} px-4 py-2 rounded-2xl flex items-center gap-2 border border-current w-fit mx-auto mt-4 ${p.glow} shadow-lg backdrop-blur-md font-bold uppercase tracking-widest text-[10px]`}>
      <Icon size={14} />
      {p.label}
    </motion.div>
  );
};

const PredictionPanel = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    study_hours: 20,
    attendance: 85,
    previous_gpa: 3.5
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setTimeout(() => setLoading(false), 800); // Artificial delay for effect
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Performance Forecast</h2>
          <p className="text-slate-400">AI-driven analytics trained on thousands of data points.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <h3 className="text-lg font-semibold text-cyan-300 mb-8 flex items-center gap-2">
              <Activity size={20} className="text-cyan-400" /> Metric Inputs
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300 uppercase tracking-wider text-[10px]">Weekly Study Hours</label>
                  <span className="text-cyan-400 font-mono font-bold">{formData.study_hours}h</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={formData.study_hours}
                  onChange={(e) => setFormData({ ...formData, study_hours: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-slate-300 uppercase tracking-wider text-[10px]">Attendance Rate</label>
                  <span className="text-cyan-400 font-mono font-bold">{formData.attendance}%</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 uppercase tracking-wider text-[10px] mb-3">Standardized GPA</label>
                <input
                  type="number" step="0.1" min="0" max="4.0"
                  value={formData.previous_gpa}
                  onChange={(e) => setFormData({ ...formData, previous_gpa: parseFloat(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-cyan-500 text-center font-mono text-2xl outline-none"
                  placeholder="E.g. 3.5"
                />
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_30px_rgba(8,145,178,0.3)] text-white font-bold py-5 rounded-2xl transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                Generate Intelligent Forecast
              </button>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-card p-10 rounded-2xl border-cyan-500/30 shadow-[0_0_50px_rgba(8,145,178,0.1)] h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <h3 className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black mb-8">AI PROBABILITY ENGINE</h3>

                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-400 blur-[80px] opacity-10 rounded-full" />
                  <div className="text-8xl font-bold text-white relative z-10 font-mono tracking-tighter">
                    {result.predicted_grade}
                  </div>
                </div>

                <StudentPersona score={result.predicted_score} />

                <div className="grid grid-cols-2 gap-6 w-full mt-10">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Confidence Score</div>
                    <div className="text-3xl font-bold text-cyan-300 font-mono">{result.predicted_score}</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
                    <div className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">System Risk</div>
                    <div className={`text-3xl font-bold font-mono ${result.risk_level === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.risk_level}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 flex flex-col h-full">
                <PerformanceChart />
                <div className="glass-card p-10 rounded-2xl flex-1 flex flex-col justify-center items-center text-center border-dashed border-slate-800">
                  <div className="p-4 rounded-full bg-slate-800 mb-4 animate-pulse">
                    <Zap size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm italic tracking-wide">Neural Network Ready. Waiting for Inputs.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div className="animate-fade-in space-y-10">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Live Statistics</h2>
      <p className="text-slate-500 text-sm">Real-time infrastructure health and student flow.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {[
        { label: 'Total Students', val: '1,240', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Avg Performance', val: '87%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Records Secured', val: '14.5k', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' }
      ].map((stat, i) => (
        <motion.div whileHover={{ y: -5 }} key={i} className="glass-card p-8 rounded-3xl flex items-center gap-6 border border-white/5 hover:border-white/10 transition-all">
          <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color}`}>
            <stat.icon size={28} />
          </div>
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
            <div className="text-3xl font-bold text-white font-mono mt-1">{stat.val}</div>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="glass-card p-10 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Database size={80} />
        </div>
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <HistoryIcon size={20} className="text-cyan-400" /> Recent Chain Activity
        </h3>
        <div className="space-y-5">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black italic shadow-lg shadow-cyan-500/20">
                  BLK
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-2">Record Hash Verified <ShieldCheck size={12} className="text-emerald-400" /></div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">0x8f...29a{i}c5df2</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">0.{i + 1}s ago</div>
            </div>
          ))}
        </div>
      </div>
      <PerformanceChart />
    </div>
  </div>
);

const HistoryIcon = ({ size, className }) => <Database size={size} className={className} />;

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [wallet, setWallet] = useState(null);

  const handleConnect = async () => {
    try {
      const w = await connectWallet();
      setWallet(w);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.03),_transparent_60%)] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_center,_#0ea5e910,_transparent_60%)] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_center,_#8b5cf608,_transparent_60%)] blur-[100px]" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64 p-12 min-h-screen relative z-0">
        <header className="flex justify-between items-center mb-16">
          <div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Academic Protocol V4.0</div>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-transparent" />
          </div>

          <button
            onClick={handleConnect}
            className={`group px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 text-xs font-black tracking-widest uppercase ${wallet
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-cyan-500/50'
              }`}
          >
            {wallet ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                {formatAddress(wallet.signer.address)}
              </>
            ) : (
              <>
                <Wallet size={16} className="group-hover:text-cyan-400 transition-colors" /> Network Auth
              </>
            )}
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'prediction' && <PredictionPanel />}
            {activeTab === 'teacher' && <TeacherPortal wallet={wallet} />}
            {activeTab === 'records' && <RecordsExplorer wallet={wallet} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
