import React, { useEffect, useState } from 'react';
import { fetchHistory, saveSearch, fetchIpInfo, deleteHistory } from '../services/api';
import { GeoData, SearchHistoryItem } from '../types';
import MapComponent from './MapComponent';
import { Search, MapPin, History, Trash2, LogOut, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [currentGeo, setCurrentGeo] = useState<GeoData | null>(null);
  const [searchIp, setSearchIp] = useState('');
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load initial state
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Fetch current user IP
        const myGeo = await fetchIpInfo();
        setCurrentGeo(myGeo);
        // Fetch history
        const hist = await fetchHistory();
        setHistory(hist);
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchIp) return;

    // Basic IP validation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(searchIp)) {
      setError('Invalid IP address format.');
      return;
    }
    setError(null);

    setLoading(true);
    try {
      const geo = await fetchIpInfo(searchIp);
      setCurrentGeo(geo);
      const newItem = await saveSearch(searchIp, geo);
      setHistory([newItem, ...history]);
    } catch (err) {
      setError('Failed to fetch data for this IP.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchIp('');
    setError(null);
    setLoading(true);
    try {
      const myGeo = await fetchIpInfo();
      setCurrentGeo(myGeo);
    } catch (err) {
        console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      await deleteHistory(Array.from(selectedIds));
      setHistory(history.filter(h => !selectedIds.has(h.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setCurrentGeo(item.geo_data);
    setSearchIp(item.searched_ip);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg text-white">
            <Globe className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">GeoTrace Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">
            {localStorage.getItem('user_email')}
          </span>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-10">
          <div className="p-4 border-b border-slate-100">
             <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                  <History className="w-4 h-4 text-primary-500" />
                  Search History
                </h2>
                {selectedIds.size > 0 && (
                  <button 
                    onClick={handleBulkDelete}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete ({selectedIds.size})
                  </button>
                )}
             </div>
             <div className="text-xs text-slate-400">
                {history.length} records found
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {history.map(item => (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border transition-all cursor-pointer group hover:shadow-md ${
                   currentGeo?.ip === item.searched_ip 
                   ? 'bg-primary-50 border-primary-200' 
                   : 'bg-white border-slate-100 hover:border-primary-100'
                }`}
                onClick={() => handleHistoryClick(item)}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{item.searched_ip}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.geo_data.city || 'Unknown City'}, {item.geo_data.country || 'Unknown'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    No history yet.
                </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col relative overflow-hidden bg-slate-50/50">
           {/* Search Bar */}
           <div className="mb-6 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto w-full z-20">
             <div className="flex-1 relative">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchIp}
                        onChange={(e) => setSearchIp(e.target.value)}
                        placeholder="Enter IP address (e.g. 8.8.8.8)"
                        className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border bg-white shadow-sm outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary-400 focus:ring-primary-100'}`}
                    />
                    {searchIp && (
                        <button 
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>
                {error && (
                    <div className="absolute top-full left-0 mt-2 text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                        {error}
                    </div>
                )}
             </div>
             <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-2xl font-medium shadow-lg shadow-primary-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 whitespace-nowrap"
             >
                {loading ? 'Locating...' : 'Track IP'}
             </button>
           </div>

           {/* Info Cards */}
           {currentGeo && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-5xl mx-auto w-full">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-semibold">IP Address</p>
                    <p className="font-mono text-slate-700 font-medium">{currentGeo.ip}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Location</p>
                    <p className="text-slate-700 font-medium truncate" title={`${currentGeo.city}, ${currentGeo.country}`}>
                        {currentGeo.city}, {currentGeo.country}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-semibold">ISP / Org</p>
                    <p className="text-slate-700 font-medium truncate" title={currentGeo.org}>
                        {currentGeo.org || 'N/A'}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Timezone</p>
                    <p className="text-slate-700 font-medium">
                        {currentGeo.timezone || 'UTC'}
                    </p>
                </div>
             </div>
           )}

           {/* Map Container */}
           <div className="flex-1 min-h-0 w-full max-w-5xl mx-auto">
              <MapComponent geoData={currentGeo} />
           </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
