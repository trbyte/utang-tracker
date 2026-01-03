import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Overview = ({ stats, recentTransactions = [], isDarkMode }) => {
  const [chartMetric, setChartMetric] = useState('MONEY'); // 'MONEY' | 'STATUS'

  const chartData = useMemo(() => {
    let data = [];
    if (chartMetric === 'MONEY') {
      data = [
        { name: 'Owed Money', value: stats.totalOwed, color: '#ce2727' },
        { name: 'Returned Money', value: stats.totalReturned, color: '#da9595' }
      ];
    } else {
      data = [
        { name: 'Pending', value: stats.pendingCount, color: '#ce2727' },
        { name: 'Completed', value: stats.completedCount, color: '#da9595' }
      ];
    }
    return data.filter(item => item.value > 0);
  }, [stats, chartMetric]);

  return (
    // Stack on mobile, Row on Desktop
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      
      {/* LEFT SECTION (Stats + Activity) */}
      <div className="w-full lg:flex-[3] flex flex-col gap-4 lg:gap-6 p-4 lg:p-5 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors shrink-0">
        
        {/* INNER CONTAINER: Stack on mobile, Row on Desktop (Side-by-Side) */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
          
          {/* Stat Cards */}
          <div className="flex-1 grid grid-cols-2 gap-2.5 min-w-0 h-auto lg:h-full content-start">
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

          {/* Recent Activity List */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 min-h-[200px] lg:min-h-0 lg:h-full">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
              Recent Activity
            </h3>

            <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 custom-scroll">
              {recentTransactions.length > 0 ? (
                recentTransactions.map(t => (
                  <div key={t.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <img src={t.avatar} className="w-7 h-7 rounded-full border border-white dark:border-slate-700 shadow-sm" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{t.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-medium">{t.status}</p>
                    </div>
                    <p className="text-xs font-black text-slate-800 dark:text-white shrink-0">₱{t.amount.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (Pie Chart) */}
      <div className="min-h-[300px] lg:min-h-0 w-full lg:flex-1 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 p-4 flex flex-col items-center justify-center relative transition-colors shrink-0">
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">Analytics</h3>
          
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex text-[9px] font-bold">
            <button 
              onClick={() => setChartMetric('MONEY')}
              className={`px-2 py-1 rounded-md transition-all ${chartMetric === 'MONEY' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              Money
            </button>
            <button 
              onClick={() => setChartMetric('STATUS')}
              className={`px-2 py-1 rounded-md transition-all ${chartMetric === 'STATUS' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
            >
              Status
            </button>
          </div>
        </div>

        <div className="w-full h-full pt-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="80%"
                paddingAngle={0} 
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                animationDuration={500}
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
                formatter={(value) => chartMetric === 'MONEY' ? `₱${value.toLocaleString()}` : `${value} Records`}
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

const StatCard = ({ title, value, footer, isAccent = false }) => (
  <div className={`p-3.5 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-0.5
      ${isAccent 
        ? 'bg-[#ce2727] text-white shadow-md shadow-[#ce272733]' 
        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
      }`}
  >
    <div>
      <p className={`text-[9px] uppercase font-black tracking-wider ${isAccent ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}`}>{title}</p>
      <h2 className="text-lg font-black mt-0.5 truncate leading-tight">{value}</h2>
    </div>
    <p className={`text-[8px] font-semibold opacity-70 uppercase`}>{footer}</p>
  </div>
);