import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, Activity, AlertTriangle, Settings, RefreshCw, Calendar, Filter 
} from 'lucide-react';

export default function App() {
  // State for data from our endpoints
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [changepoints, setChangepoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EXPLICIT INTERACTIVE FILTER STATES ---
  const [selectedTimeline, setSelectedTimeline] = useState('all'); // 'all', 'post-2022', 'recent'
  const [selectedSeverity, setSelectedSeverity] = useState('all'); // 'all', 'high', 'moderate'
  const [highlightedEventDate, setHighlightedEventDate] = useState(null);

  useEffect(() => {
    // Fetch data from Flask running on port 5001
    Promise.all([
      fetch('http://localhost:5001/api/v1/prices/historical').then(res => {
        if (!res.ok) throw new Error("Failed to fetch historical prices");
        return res.json();
      }),
      fetch('http://localhost:5001/api/v1/events/correlations').then(res => {
        if (!res.ok) throw new Error("Failed to fetch event correlations");
        return res.json();
      }),
      fetch('http://localhost:5001/api/v1/models/changepoints').then(res => {
        if (!res.ok) throw new Error("Failed to fetch change points");
        return res.json();
      })
    ])
    .then(([pricesData, eventsData, cpData]) => {
      setPrices(pricesData);
      setEvents(eventsData);
      setChangepoints(cpData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching dashboard backend APIs:", err);
      setError(err.message);
      setLoading(false);
    });
  }, []);

  // --- FILTER LOGIC FOR INTERACTIVE CONTROLS ---
  const getFilteredPrices = () => {
    if (!prices || prices.length === 0) return [];
    
    return prices.filter(item => {
      const itemDate = new Date(item.Date);
      if (selectedTimeline === 'post-2022') {
        return itemDate >= new Date('2022-01-01');
      }
      if (selectedTimeline === 'recent') {
        return itemDate >= new Date('2024-01-01');
      }
      return true; // 'all'
    });
  };

  const getFilteredEvents = () => {
    if (!events || events.length === 0) return [];

    return events.filter(item => {
      if (selectedSeverity === 'high') {
        return item.Severity === 'High' || item.ImpactScore >= 7;
      }
      if (selectedSeverity === 'moderate') {
        return item.Severity === 'Moderate' || (item.ImpactScore >= 4 && item.ImpactScore < 7);
      }
      return true; // 'all'
    });
  };

  const filteredPrices = getFilteredPrices();
  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <RefreshCw className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading Birhan Energies Quantitative Pipeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-red-400 p-6">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Backend Connection Error</h2>
        <p className="text-sm max-w-md text-center text-slate-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-950 border border-red-800 hover:bg-red-900 text-red-200 px-4 py-2 rounded text-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-900 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            BIRHAN ENERGIES
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            Brent Crude Quantitative Analytics & Dynamic Volatility Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Pipeline Connected: Port 5001
        </div>
      </header>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-900 border border-slate-900 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Latest Spot Price</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">
              ${prices[prices.length - 1]?.Price?.toFixed(2) || '0.00'}
            </h3>
          </div>
          <div className="bg-emerald-950/50 p-3 rounded-lg border border-emerald-900/30 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-900 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Pipeline Days</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{prices.length}</h3>
          </div>
          <div className="bg-blue-950/50 p-3 rounded-lg border border-blue-900/30 text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-900 rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Bayesian Change Points</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{changepoints.length}</h3>
          </div>
          <div className="bg-amber-950/50 p-3 rounded-lg border border-amber-900/30 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- EXPLICIT INTERACTIVE CONTROLS PANEL (GAP 3 RESOLUTION) --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Explicit Dashboard Controls:</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* Timeline View Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-xs text-slate-400 font-medium">Timeline Range:</label>
            <select 
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Data (2019 - Present)</option>
              <option value="post-2022">Post-Ukraine Invasion (2022 - Present)</option>
              <option value="recent">Recent Era (2024 - Present)</option>
            </select>
          </div>

          {/* Event Intensity Filter */}
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <label className="text-xs text-slate-400 font-medium">Filter Shocks by Severity:</label>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Shock Levels</option>
              <option value="high">High Severity Only</option>
              <option value="moderate">Moderate Severity Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Side Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Price Timeline Panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-900 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            Historical Spot Price and Quantitative Structural Breaks
          </h2>
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPrices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="Date" stroke="#64748b" tickLine={false} style={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#64748b" tickLine={false} style={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                  name="Brent Spot Price ($)" 
                  type="monotone" 
                  dataKey="Price" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false} 
                />

                {/* Display Change Points generated from Python backend model */}
                {changepoints.map((cp, idx) => (
                  <ReferenceLine 
                    key={`cp-${idx}`}
                    x={cp.Date} 
                    stroke="#f59e0b" 
                    strokeDasharray="4 4"
                    label={{ value: `Break: ${cp.Date}`, fill: '#f59e0b', fontSize: 10, position: 'top' }}
                  />
                ))}

                {/* Draw highlighted active event selection projection line */}
                {highlightedEventDate && (
                  <ReferenceLine 
                    x={highlightedEventDate} 
                    stroke="#ef4444" 
                    strokeWidth={2.5}
                    label={{ value: "Target Event", fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Sidebar: Geopolitical Event Cross-Referencing Panel */}
        <div className="bg-slate-900 border border-slate-900 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-4">Geopolitical Events</h2>
            <p className="text-xs text-slate-500 mb-4">
              Click an event below to overlay its precise temporal reference marker directly on the chart timeline:
            </p>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  onClick={() => setHighlightedEventDate(evt.Date)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    highlightedEventDate === evt.Date 
                      ? 'bg-emerald-950/40 border-emerald-500' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">{evt.Date}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      evt.Severity === 'High' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                    }`}>
                      {evt.Severity} Impact
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 leading-snug">{evt.Event}</h4>
                </div>
              ))}
            </div>
          </div>

          {highlightedEventDate && (
            <button 
              onClick={() => setHighlightedEventDate(null)}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-1.5 rounded text-xs transition-colors"
            >
              Clear Active Overlay
            </button>
          )}
        </div>

      </div>
    </div>
  );
}