import { useState, useEffect } from "react";
import {
  LayoutDashboard, Calendar, Hotel, Users, DollarSign, Settings, Bell, Search,
  TrendingUp, PieChart, Clock, CheckCircle, AlertCircle, Plus, X, Star,
  Package, MessageSquare, Wrench, LogOut, RefreshCw, Mail, ClipboardList
} from "lucide-react";
import {
  Line, LineChart, Pie, PieChart as RechartsPieChart, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

// ─── Admin-specific API helpers (separate token storage so admin & customer sessions don't conflict) ───
const API_BASE = "http://localhost:5000/api";

function adminAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

function getAdminUser() {
  const u = localStorage.getItem("admin_user");
  return u ? JSON.parse(u) : null;
}

async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  const data = await res.json();
  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data));
  return data;
}

function adminLogout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

// Admin API wrappers — all use admin token
async function adminGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers: adminAuthHeaders() });
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}
async function adminPost(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", headers: adminAuthHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}
async function adminPut(path: string, body?: any) {
  const res = await fetch(`${API_BASE}${path}`, { method: "PUT", headers: adminAuthHeaders(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}
async function adminDelete(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers: adminAuthHeaders() });
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}

const COLORS = ["#d4af37", "#1e40af", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// ─── Login Screen ────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await adminLogin(email, password);
      if (user.role !== "manager" && user.role !== "receptionist") {
        setError("Access denied. Admin/Manager credentials required.");
        adminLogout();
        return;
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Grand Horizon
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">Admin Panel</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="setemail@gmail.com"

              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin} disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-3 rounded-lg transition-colors text-lg disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────
export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!getAdminUser());
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states — all start empty/zero, populated from backend
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [report, setReport] = useState<any>({ totalBookings: 0, confirmedBookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(false);

  // Activity log
  const [activityLog, setActivityLog] = useState<{time: string; action: string}[]>([]);
  const addLog = (action: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLog(prev => [{ time, action }, ...prev].slice(0, 50));
  };

  // Modal states
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: "", type: "single", price: 0, description: "", amenities: "" });
  const [newItem, setNewItem] = useState({ itemName: "", category: "linen", quantity: 0, threshold: 10 });

  const user = getAdminUser();

  // Fetch data from backend
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, b, f, s, st, inv, rep] = await Promise.allSettled([
        adminGet('/rooms/all'), adminGet('/bookings'), adminGet('/feedback'),
        adminGet('/services'), adminGet('/staff'), adminGet('/inventory'), adminGet('/reports/summary')
      ]);
      if (r.status === "fulfilled") setRooms(r.value);
      if (b.status === "fulfilled") setBookings(b.value);
      if (f.status === "fulfilled") setFeedbacks(f.value);
      if (s.status === "fulfilled") setServices(s.value);
      if (st.status === "fulfilled") setStaff(st.value);
      if (inv.status === "fulfilled") setInventory(inv.value);
      if (rep.status === "fulfilled") setReport(rep.value);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => {
    if (loggedIn) fetchAll();
  }, [loggedIn]);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const handleLogout = () => { adminLogout(); setLoggedIn(false); };

  // Computed stats from real data
  const totalRevenue = report.revenue || 0;
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "checked-in").length;
  const availableRooms = rooms.filter(r => r.status === "available").length;
  const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
  const maintenanceRooms = rooms.filter(r => r.status === "maintenance" || r.status === "cleaning").length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0";

  // Room type distribution for pie chart
  const roomTypeCounts: Record<string, number> = {};
  rooms.forEach((r: any) => { roomTypeCounts[r.type] = (roomTypeCounts[r.type] || 0) + 1; });
  const pieData = Object.entries(roomTypeCounts).map(([name, value]) => ({ name, value }));

  // Revenue by day (from bookings with totalAmount, grouped by createdAt day)
  const revByDay: Record<string, number> = {};
  bookings.forEach((b: any) => {
    if (b.paymentStatus === "paid" && b.createdAt) {
      const day = new Date(b.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      revByDay[day] = (revByDay[day] || 0) + (b.totalAmount || 0);
    }
  });
  const revenueChartData = Object.entries(revByDay).map(([day, revenue]) => ({ day, revenue }));

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
    { icon: Calendar, label: "Bookings", view: "bookings" },
    { icon: Hotel, label: "Rooms", view: "rooms" },
    { icon: Users, label: "Guests/Staff", view: "staff" },
    { icon: DollarSign, label: "Payments", view: "payments" },
    { icon: Wrench, label: "Room Service", view: "services" },
    { icon: MessageSquare, label: "Feedback", view: "feedback" },
    { icon: Package, label: "Inventory", view: "inventory" },
    { icon: Settings, label: "Settings", view: "settings" },
    { icon: ClipboardList, label: "Activity Log", view: "logs" },
  ];

  // Status badge helper
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      available: "bg-green-100 text-green-700", occupied: "bg-blue-100 text-blue-700",
      cleaning: "bg-yellow-100 text-yellow-700", maintenance: "bg-orange-100 text-orange-700",
      pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700",
      "checked-in": "bg-blue-100 text-blue-700", "checked-out": "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-700",
      refunded: "bg-red-100 text-red-700", success: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700", requested: "bg-yellow-100 text-yellow-700",
      "in-progress": "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  // Add room handler
  const handleAddRoom = async () => {
    try {
      await adminPost('/rooms', {
        roomNumber: newRoom.roomNumber,
        type: newRoom.type,
        price: newRoom.price,
        description: newRoom.description,
        amenities: newRoom.amenities.split(",").map(a => a.trim()).filter(Boolean),
      });
      setShowAddRoom(false);
      setNewRoom({ roomNumber: "", type: "single", price: 0, description: "", amenities: "" });
      addLog(`Added new room #${newRoom.roomNumber} (${newRoom.type})`);
      fetchAll();
    } catch (err: any) { alert(err.message); }
  };

  // Add inventory item handler
  const handleAddInventory = async () => {
    try {
      await adminPost('/inventory', newItem);
      setShowAddInventory(false);
      addLog(`Added inventory item: ${newItem.itemName} (qty: ${newItem.quantity})`);
      setNewItem({ itemName: "", category: "linen", quantity: 0, threshold: 10 });
      fetchAll();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl tracking-wider" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Grand Horizon
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${activeView === item.view ? "bg-[#d4af37] text-black" : "text-white/70 hover:bg-white/5"
                  }`}>
                <Icon size={20} /><span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#d4af37] rounded-full flex items-center justify-center text-black text-sm font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-white/50">{user?.role || "manager"}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-2 px-4 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bookings, rooms, guests..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <button onClick={fetchAll} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh data">
              <RefreshCw size={20} className={`text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={22} className="text-gray-600" />
              {bookings.filter(b => b.status === "pending").length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* ═══ DASHBOARD ═══ */}
          {activeView === "dashboard" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Dashboard Overview
              </h2>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: DollarSign, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "bg-green-500" },
                  { icon: Calendar, label: "Active Bookings", value: String(activeBookings), color: "bg-blue-500" },
                  { icon: Hotel, label: "Available Rooms", value: String(availableRooms), color: "bg-purple-500" },
                  { icon: Star, label: "Avg. Rating", value: `${avgRating}/5`, color: "bg-yellow-500" },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                          <Icon size={24} className="text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{card.label}</p>
                      <p className="text-3xl text-gray-900">{card.value}</p>
                    </div>
                  );
                })}
              </div>
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#d4af37]" /> Revenue Overview
                  </h3>
                  {revenueChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ fill: "#d4af37", r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      No revenue data yet. Revenue will appear here when bookings are confirmed and paid.
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-[#d4af37]" /> Room Distribution
                  </h3>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100} dataKey="value">
                          {pieData.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      No rooms added yet. Add rooms to see distribution.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Room Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-600">Available</span><span className="text-green-600 font-semibold">{availableRooms}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Occupied</span><span className="text-blue-600 font-semibold">{occupiedRooms}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Maintenance/Cleaning</span><span className="text-orange-600 font-semibold">{maintenanceRooms}</span></div>
                    <div className="flex justify-between border-t pt-3"><span className="text-gray-900 font-medium">Total Rooms</span><span className="text-gray-900 font-bold">{rooms.length}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Bookings Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-semibold">{report.totalBookings}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Confirmed</span><span className="text-green-600 font-semibold">{report.confirmedBookings}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Pending</span><span className="text-yellow-600 font-semibold">{bookings.filter(b => b.status === "pending").length}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Service Requests</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-600">Requested</span><span className="text-yellow-600 font-semibold">{services.filter(s => s.status === "requested").length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">In Progress</span><span className="text-blue-600 font-semibold">{services.filter(s => s.status === "in-progress").length}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Completed</span><span className="text-green-600 font-semibold">{services.filter(s => s.status === "completed").length}</span></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ ROOMS ═══ */}
          {activeView === "rooms" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Room Management</h2>
                  <p className="text-gray-600">Manage all hotel rooms — status: available, occupied, cleaning, maintenance</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm">{availableRooms}</span></div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-sm">{occupiedRooms}</span></div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span className="text-sm">{maintenanceRooms}</span></div>
                  <button onClick={() => setShowAddRoom(true)} className="px-4 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors flex items-center gap-2">
                    <Plus size={16} /> Add Room
                  </button>
                </div>
              </div>

              {rooms.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <Hotel size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Rooms Yet</h3>
                  <p className="text-gray-500 mb-6">Click "Add Room" to create your first room.</p>
                  <button onClick={() => setShowAddRoom(true)} className="px-6 py-3 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors">+ Add Room</button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Room #</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Type</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Price</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Status</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Amenities</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room: any) => (
                          <tr key={room._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 font-medium">#{room.roomNumber}</td>
                            <td className="px-6 py-4 text-gray-700 capitalize">{room.type}</td>
                            <td className="px-6 py-4 text-gray-900">₹{room.price}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${statusBadge(room.status)}`}>{room.status}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">{room.amenities?.join(", ") || "-"}</td>
                            <td className="px-6 py-4">
                              <select
                                value={room.status}
                                onChange={async (e) => { await adminPut(`/rooms/${room._id}/status`, { status: e.target.value }); addLog(`Changed room #${room.roomNumber} status to ${e.target.value}`); fetchAll(); }}
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
                              >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add Room Modal */}
              {showAddRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl text-gray-900">Add New Room</h3>
                      <button onClick={() => setShowAddRoom(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Room Number *</label>
                        <input type="text" value={newRoom.roomNumber} onChange={e => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                          placeholder="e.g. 101" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Type *</label>
                          <select value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none">
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="suite">Suite</option>
                            <option value="deluxe">Deluxe</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Price / Night (₹) *</label>
                          <input type="number" value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                            placeholder="e.g. 3000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Description</label>
                        <textarea value={newRoom.description} onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
                          placeholder="Spacious room with..." rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none resize-none" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Amenities (comma-separated)</label>
                        <input type="text" value={newRoom.amenities} onChange={e => setNewRoom({ ...newRoom, amenities: e.target.value })}
                          placeholder="WiFi, AC, TV" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                      </div>
                      <button onClick={handleAddRoom} className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-3 rounded-lg transition-colors text-lg">
                        Create Room
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ BOOKINGS ═══ */}
          {activeView === "bookings" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Bookings Management</h2>
                  <p className="text-gray-600">View and manage all hotel bookings — status: pending, confirmed, checked-in, checked-out, cancelled</p>
                </div>
              </div>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-500">Bookings will appear here when customers make reservations.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Confirmation</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Guest</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Room</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Check-in</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Check-out</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Amount</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Status</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Payment</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b: any) => (
                          <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 text-sm font-mono">{b.confirmationCode || b._id?.slice(-8)}</td>
                            <td className="px-6 py-4 text-gray-900">{b.customer?.name || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-700">#{b.room?.roomNumber || "—"} ({b.room?.type || ""})</td>
                            <td className="px-6 py-4 text-gray-700">{new Date(b.checkIn).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-gray-700">{new Date(b.checkOut).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-gray-900">₹{b.totalAmount?.toLocaleString()}</td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${statusBadge(b.status)}`}>{b.status}</span></td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${statusBadge(b.paymentStatus)}`}>{b.paymentStatus}</span></td>
                            <td className="px-6 py-4 flex gap-2 flex-wrap">
                              {b.status === "pending" && (
                                <button onClick={async () => { await adminPut(`/bookings/${b._id}/confirm`); addLog(`Confirmed booking #${b._id.slice(-6)} for ${b.customer?.name || 'guest'}`); fetchAll(); }}
                                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">Confirm</button>
                              )}
                              {(b.status === "confirmed" || b.status === "checked-in") && (
                                <button onClick={async () => { await adminPut(`/bookings/${b._id}/checkout`); addLog(`Checked out booking #${b._id.slice(-6)} for ${b.customer?.name || 'guest'}`); fetchAll(); }}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">Check Out</button>
                              )}
                              <button onClick={async () => {
                                try {
                                  await adminPost(`/bookings/${b._id}/resend-email`, {});
                                  addLog(`Resent confirmation email for booking #${b._id.slice(-6)} to ${b.customer?.email || 'guest'}`);
                                  alert("Confirmation email sent!");
                                } catch (err: any) { alert(err.message || "Failed to send email"); }
                              }}
                                className="px-3 py-1 bg-[#d4af37] text-black text-xs rounded-lg hover:bg-[#c49d2e] flex items-center gap-1"><Mail size={12} /> Send Mail</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ STAFF / GUESTS ═══ */}
          {activeView === "staff" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Staff Management</h2>
              <p className="text-gray-600 mb-8">All non-customer users — roles: receptionist, housekeeping, manager</p>
              {staff.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Staff Found</h3>
                  <p className="text-gray-500">Register staff members via the API with roles: receptionist, housekeeping, manager.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Name</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Email</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Role</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Joined</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((s: any) => (
                          <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{s.name}</td>
                            <td className="px-6 py-4 text-gray-700">{s.email}</td>
                            <td className="px-6 py-4"><span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 capitalize">{s.role}</span></td>
                            <td className="px-6 py-4 text-gray-700">{new Date(s.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <button onClick={async () => { if (confirm("Remove this staff member?")) { await adminDelete(`/staff/${s._id}`); addLog(`Removed staff member: ${s.name}`); fetchAll(); } }}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ PAYMENTS ═══ */}
          {activeView === "payments" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Payment Records</h2>
              <p className="text-gray-600 mb-8">Payments are linked to bookings — method: card, cash, upi, netbanking — status: pending, success, failed</p>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Payments Yet</h3>
                  <p className="text-gray-500">Payments will appear when customers pay for bookings.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Booking</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Guest</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Amount</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Payment Status</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b: any) => (
                          <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900 font-mono text-sm">{b.confirmationCode || b._id?.slice(-8)}</td>
                            <td className="px-6 py-4 text-gray-900">{b.customer?.name || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-900">₹{b.totalAmount?.toLocaleString()}</td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${statusBadge(b.paymentStatus)}`}>{b.paymentStatus}</span></td>
                            <td className="px-6 py-4 text-gray-700">{new Date(b.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ ROOM SERVICE ═══ */}
          {activeView === "services" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Room Service Requests</h2>
              <p className="text-gray-600 mb-8">Service types: food, laundry, cleaning, maintenance, other — statuses: requested, in-progress, completed</p>
              {services.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Service Requests</h3>
                  <p className="text-gray-500">Requests will appear here when guests request room services.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Guest</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Type</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Description</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Status</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((s: any) => (
                          <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{s.customer?.name || "N/A"}</td>
                            <td className="px-6 py-4 text-gray-700 capitalize">{s.serviceType}</td>
                            <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{s.description || "—"}</td>
                            <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${statusBadge(s.status)}`}>{s.status}</span></td>
                            <td className="px-6 py-4">
                              <select value={s.status}
                                onChange={async (e) => { await adminPut(`/services/${s._id}/status`, { status: e.target.value }); addLog(`Updated ${s.serviceType} service status to ${e.target.value} for ${s.customer?.name || 'guest'}`); fetchAll(); }}
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#d4af37] focus:outline-none">
                                <option value="requested">Requested</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ FEEDBACK ═══ */}
          {activeView === "feedback" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Guest Feedback</h2>
              <p className="text-gray-600 mb-8">Guest reviews — rating: 1–5 stars</p>
              {feedbacks.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Feedback Yet</h3>
                  <p className="text-gray-500">Feedback will appear here when guests leave reviews.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {feedbacks.map((f: any) => (
                    <div key={f._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-gray-900 font-medium">{f.customer?.name || "Anonymous"}</p>
                          <p className="text-gray-500 text-sm">{f.customer?.email}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-[#d4af37] text-black px-3 py-1 rounded-lg text-sm">
                          <Star size={14} fill="currentColor" /> {f.rating}
                        </div>
                      </div>
                      <p className="text-gray-600">{f.comment || "No comment provided."}</p>
                      <p className="text-gray-400 text-xs mt-3">{new Date(f.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ INVENTORY ═══ */}
          {activeView === "inventory" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Inventory Management</h2>
                  <p className="text-gray-600">Categories: linen, toiletries, food, maintenance, other — alerts when below threshold</p>
                </div>
                <button onClick={() => setShowAddInventory(true)} className="px-4 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#c49d2e] transition-colors flex items-center gap-2">
                  <Plus size={16} /> Add Item
                </button>
              </div>
              {inventory.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Inventory Items</h3>
                  <p className="text-gray-500 mb-6">Click "Add Item" to add inventory items.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Item</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Category</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Quantity</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Threshold</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((item: any) => (
                          <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{item.itemName}</td>
                            <td className="px-6 py-4 text-gray-700 capitalize">{item.category}</td>
                            <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
                            <td className="px-6 py-4 text-gray-700">{item.threshold}</td>
                            <td className="px-6 py-4">
                              {item.quantity < item.threshold ? (
                                <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                                  <AlertCircle size={14} /> Low Stock
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                  <CheckCircle size={14} /> In Stock
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add Inventory Modal */}
              {showAddInventory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl text-gray-900">Add Inventory Item</h3>
                      <button onClick={() => setShowAddInventory(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Item Name *</label>
                        <input type="text" value={newItem.itemName} onChange={e => setNewItem({ ...newItem, itemName: e.target.value })}
                          placeholder="e.g. Bath Towels" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Category</label>
                          <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none">
                            <option value="linen">Linen</option>
                            <option value="toiletries">Toiletries</option>
                            <option value="food">Food</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
                          <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Alert Threshold</label>
                          <input type="number" value={newItem.threshold} onChange={e => setNewItem({ ...newItem, threshold: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:outline-none" />
                        </div>
                      </div>
                      <button onClick={handleAddInventory} className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-3 rounded-lg transition-colors text-lg">
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ SETTINGS ═══ */}
          {activeView === "settings" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Settings</h2>
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 max-w-2xl">
                <h3 className="text-xl text-gray-900 mb-6">Backend Connection</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span>API URL</span><span className="text-gray-900 font-mono text-sm">http://localhost:5000/api</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span>Logged in as</span><span className="text-gray-900">{user?.name} ({user?.role})</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span>Total Rooms</span><span className="text-gray-900">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span>Total Bookings</span><span className="text-gray-900">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span>Total Revenue</span><span className="text-gray-900">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ LOGS ═══ */}
          {activeView === "logs" && (
            <>
              <h2 className="text-3xl text-gray-900 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Activity Log</h2>
              {activityLog.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
                  <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-2">No Activities Logged Yet</h3>
                  <p className="text-gray-500 mb-6">Actions taken in the admin dashboard will appear here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Time</th>
                          <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-600">Action performed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLog.map((log, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-700 w-48 font-medium">{log.time}</td>
                            <td className="px-6 py-4 text-gray-900">{log.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
