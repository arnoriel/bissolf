import { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { 
  Box, Send, Truck, CheckCircle, Users, Wallet, 
  ArrowUpRight, X, ChevronLeft, ChevronRight, Search, TrendingUp, TrendingDown,
  XCircle} from 'lucide-react';

export const DashboardHome = () => {
  const { orders } = useStore();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // 1. Logic Statistik Ganda & Trending Riil (Hanya menghitung order yang TIDAK Canceled untuk Revenue)
  const { chartData, revenueTrend, stats } = useMemo(() => {
    const dataMap: Record<string, { time: string, revenue: number, sales: number, timestamp: number }> = {};
    
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    let currentPeriodRevenue = 0;
    let previousPeriodRevenue = 0;

    // Inisialisasi Stats
    const counts = {
      packaging: 0,
      ready: 0,
      delivery: 0,
      done: 0,
      canceled: 0,
      totalRevenue: 0, // Ini akan menjadi Pendapatan Bersih (Net Revenue)
      totalSalesCount: 0,
      canceledRevenue: 0 // Uang yang dikembalikan/batal
    };

    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const timestamp = orderDate.getTime();
      const label = orderDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit' }) + ':00';

      // Update Counts berdasarkan status
      if (order.status === 'Packaging') counts.packaging++;
      if (order.status === 'Ready to Send') counts.ready++;
      if (order.status === 'On Delivery') counts.delivery++;
      if (order.status === 'Done') counts.done++;
      
      if (order.status === 'Canceled') {
        counts.canceled++;
        counts.canceledRevenue += order.total_price;
      } else {
        // Hanya masukkan revenue & sales jika status BUKAN Canceled
        counts.totalRevenue += order.total_price;
        counts.totalSalesCount += order.quantity;

        // Grouping untuk Chart (Hanya yang tidak batal)
        if (!dataMap[label]) {
          dataMap[label] = { time: label, revenue: 0, sales: 0, timestamp };
        }
        dataMap[label].revenue += order.total_price;
        dataMap[label].sales += order.quantity;

        // Logic Trending (Hanya yang tidak batal)
        if (timestamp > now - twentyFourHours) {
          currentPeriodRevenue += order.total_price;
        } else if (timestamp > now - (twentyFourHours * 2)) {
          previousPeriodRevenue += order.total_price;
        }
      }
    });

    // Hitung Persentase Trend
    let trend = 0;
    if (previousPeriodRevenue > 0) {
      trend = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
    } else if (currentPeriodRevenue > 0) {
      trend = 100;
    }

    return {
      chartData: Object.values(dataMap).sort((a, b) => a.timestamp - b.timestamp),
      revenueTrend: trend.toFixed(1),
      stats: counts
    };
  }, [orders]);

  // 2. Logic Customer Unik
  const uniqueCustomers = useMemo(() => {
    const customers = new Map();
    orders.forEach(o => {
      if (!customers.has(o.buyer_phone)) {
        customers.set(o.buyer_phone, { 
          name: o.buyer_name, 
          phone: o.buyer_phone, 
          totalOrders: 1,
          lastPurchase: o.created_at 
        });
      } else {
        const existing = customers.get(o.buyer_phone);
        existing.totalOrders += 1;
      }
    });
    return Array.from(customers.values());
  }, [orders]);

  const filteredCustomers = uniqueCustomers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage, 
    currentPage * customersPerPage
  );

  return (
    <div className="p-6 space-y-8 bg-[#fcfcfd]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Market Analytics</h2>
          <p className="text-gray-500 font-medium">Monitoring performa BISSOLF secara real-time.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Updates</p>
          <p className="text-sm font-bold text-green-500 flex items-center justify-end gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> System Active
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* REVENUE CARD (Net Revenue - Sudah Terpotong Cancel) */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet size={20} className="text-blue-100" />
              </div>
              <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">Net Balance Generated</p>
            </div>
            <h3 className="text-5xl font-black mb-4 tracking-tighter">
              Rp {stats.totalRevenue.toLocaleString()}
            </h3>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                Number(revenueTrend) >= 0 
                ? 'bg-green-400/20 text-green-300 border-green-400/30' 
                : 'bg-red-400/20 text-red-300 border-red-400/30'
              }`}>
                {Number(revenueTrend) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {revenueTrend}%
              </div>
              <p className="text-blue-200 text-[10px] font-medium uppercase tracking-wider">
                vs 24 jam terakhir
              </p>
              <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
              <div className="flex flex-col">
                <p className="text-red-200 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <XCircle size={10} /> Loss / Refunded
                </p>
                <p className="text-white text-xs font-black">
                  Rp {stats.canceledRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>

        <button 
          onClick={() => setShowCustomerModal(true)}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users size={28} />
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Loyal Customers</p>
            <h3 className="text-4xl font-black text-gray-900">{uniqueCustomers.length}</h3>
            <p className="text-purple-600 text-xs font-bold mt-2">Database Pelanggan →</p>
          </div>
        </button>
      </div>
      
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="font-black text-gray-800 text-xl">Net Revenue Flow</h4>
              <p className="text-sm text-gray-400 font-medium">Grafik arus kas bersih (Excl. Canceled)</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Flow</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} minTickGap={30} />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [`Rp ${Number(val || 0).toLocaleString()}`, "Net Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2 text-center">Net Sales Volume</p>
            <h3 className="text-5xl font-black mb-2 text-center tracking-tight">{stats.totalSalesCount}</h3>
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest font-bold">Items Sold (Excl. Batal)</p>
          </div>
          <div className="h-40 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line type="step" dataKey="sales" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(val: any) => [`${val} Items`, 'Sales']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status Progress & Cancellation Info */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Packaging', value: stats.packaging, icon: <Box size={20}/>, color: 'orange' },
          { label: 'Ready', value: stats.ready, icon: <Send size={20}/>, color: 'blue' },
          { label: 'On Way', value: stats.delivery, icon: <Truck size={20}/>, color: 'purple' },
          { label: 'Done', value: stats.done, icon: <CheckCircle size={20}/>, color: 'green' },
          { label: 'Canceled', value: stats.canceled, icon: <XCircle size={20}/>, color: 'red' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-500 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">{item.label}</p>
              <h3 className={`text-2xl font-black ${item.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CUSTOMER */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setShowCustomerModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Database Pelanggan</h3>
                <p className="text-sm text-gray-400 font-medium">Total {uniqueCustomers.length} pelanggan terdaftar</p>
              </div>
              <button onClick={() => setShowCustomerModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition"><X /></button>
            </div>
            
            <div className="p-8 space-y-6 flex-1 overflow-y-auto text-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau nomor telepon..." 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  value={customerSearch}
                  onChange={(e) => {setCustomerSearch(e.target.value); setCurrentPage(1);}}
                />
              </div>

              <div className="space-y-3">
                {paginatedCustomers.map((cust, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{cust.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{cust.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-blue-600">{cust.totalOrders} Pesanan</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
              <p className="text-xs font-bold text-gray-400 tracking-widest">HALAMAN {currentPage} DARI {totalPages || 1}</p>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-50"><ChevronLeft size={20} /></button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-50"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};