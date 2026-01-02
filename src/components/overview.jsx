
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Overview = ({ stats, recentTransactions, isDarkMode }) => {
  const chartData = [
    { name: 'Owed', value: stats.totalOwed, color: '#ce2727' },
    { name: 'Returned', value: stats.totalReturned, color: '#da9595' }
  ];

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-[3] flex gap-6 p-5 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="w-[320px] shrink-0 grid grid-cols-2 grid-rows-2 gap-2.5">
          <StatCard 
            title="Owed" 
            value={`₱${stats.totalOwed.toLocaleString()}`} 
            footer={`By ${stats.lastUpdated}`}
            isAccent
          />
          <StatCard 
            title="Returned" 
            value={`₱${stats.totalReturned.toLocaleString()}`} 
            footer={`By ${stats.lastUpdated}`}
          />
          <StatCard 
            title="Completed" 
            value={stats.completedCount.toString()} 
            footer="Settled"
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingCount.toString()} 
            footer="Active"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">Recent Activity</h3>
          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 custom-scroll">
            {recentTransactions.map(t => (
              <div key={t.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <img src={t.avatar} className="w-7 h-7 rounded-full border border-white dark:border-slate-700 shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{t.name}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-medium">{t.status}</p>
                </div>
                <p className="text-xs font-black text-slate-800 dark:text-white shrink-0">₱{t.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 p-4 flex flex-col items-center justify-center relative transition-colors">
        <h3 className="absolute top-4 left-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Revenue Mix</h3>
        <div className="w-full h-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={35}
                outerRadius={55}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontSize: '11px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                  color: isDarkMode ? '#f8fafc' : '#334155'
                }}
                formatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Legend 
                verticalAlign="bottom" 
                height={20} 
                iconType="circle"
                wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Added default value for isAccent to fix missing property errors in component calls
const StatCard = ({ title, value, footer, isAccent = false }) => (
  <div className={`p-3.5 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-0.5 ${isAccent ? 'bg-[#ce2727] text-white shadow-md shadow-[#ce272733]' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
    <div>
      <p className={`text-[9px] uppercase font-black tracking-wider ${isAccent ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}>{title}</p>
      <h2 className="text-lg font-black mt-0.5 truncate leading-tight">{value}</h2>
    </div>
    <p className={`text-[8px] font-semibold opacity-70 uppercase`}>{footer}</p>
  </div>
);
