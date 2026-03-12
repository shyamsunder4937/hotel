// Central API utility – matches backend endpoints exactly
const API_BASE = "http://localhost:5000/api";

// Get token from localStorage (set after login)
function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// ─── Auth ────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export async function registerUser(name: string, email: string, password: string, role = "customer") {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

// ─── Rooms ───────────────────────────────────────────
// Public: search available rooms (type, minPrice, maxPrice)
export async function searchRooms(params?: { type?: string; minPrice?: number; maxPrice?: number }) {
  const query = new URLSearchParams();
  if (params?.type) query.set("type", params.type);
  if (params?.minPrice) query.set("minPrice", String(params.minPrice));
  if (params?.maxPrice) query.set("maxPrice", String(params.maxPrice));
  const res = await fetch(`${API_BASE}/rooms?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

// Protected: get ALL rooms (manager/receptionist)
export async function getAllRooms() {
  const res = await fetch(`${API_BASE}/rooms/all`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch all rooms");
  return res.json();
}

// Protected: add a room (manager)
export async function addRoom(room: { roomNumber: string; type: string; price: number; amenities?: string[]; description?: string; images?: string[] }) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

// Protected: update room status
export async function updateRoomStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/rooms/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update room status");
  return res.json();
}

// Protected: set room price
export async function setRoomPrice(id: string, price: number) {
  const res = await fetch(`${API_BASE}/rooms/${id}/price`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ price }),
  });
  if (!res.ok) throw new Error("Failed to update room price");
  return res.json();
}

// ─── Bookings ────────────────────────────────────────
// Protected: create booking (customer)
export async function createBooking(roomId: string, checkIn: string, checkOut: string) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ roomId, checkIn, checkOut }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

// Protected: get all bookings (manager/receptionist)
export async function getAllBookings() {
  const res = await fetch(`${API_BASE}/bookings`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

// Protected: get my bookings
export async function getMyBookings() {
  const res = await fetch(`${API_BASE}/bookings/my`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch my bookings");
  return res.json();
}

// Protected: confirm booking
export async function confirmBooking(id: string) {
  const res = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to confirm booking");
  return res.json();
}

// Protected: checkout booking
export async function checkOutBooking(id: string) {
  const res = await fetch(`${API_BASE}/bookings/${id}/checkout`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to check out");
  return res.json();
}

// Public: verify booking via token
export async function verifyBooking(token: string) {
  const res = await fetch(`${API_BASE}/bookings/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

// ─── Payments ────────────────────────────────────────
// Protected: process payment (matches backend: bookingId, method, transactionId)
export async function processPayment(bookingId: string, method: string, transactionId?: string) {
  const res = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ bookingId, method, transactionId }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

// Protected: get my payments
export async function getMyPayments() {
  const res = await fetch(`${API_BASE}/payments/my`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

// ─── Feedback ────────────────────────────────────────
// Protected: submit feedback (customer)
export async function submitFeedback(data: { booking?: string; rating: number; comment?: string }) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

// Protected: get all feedback (manager)
export async function getAllFeedback() {
  const res = await fetch(`${API_BASE}/feedback`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
}

// ─── Room Service ────────────────────────────────────
// Protected: request room service (customer)
export async function requestRoomService(data: { booking: string; serviceType: string; description?: string }) {
  const res = await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to request service");
  return res.json();
}

// Protected: get all room service requests (manager/housekeeping)
export async function getAllRoomServices() {
  const res = await fetch(`${API_BASE}/services`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

// Protected: update room service status
export async function updateRoomServiceStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/services/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

// ─── Staff ───────────────────────────────────────────
export async function getAllStaff() {
  const res = await fetch(`${API_BASE}/staff`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
}

export async function removeStaff(id: string) {
  const res = await fetch(`${API_BASE}/staff/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove staff");
  return res.json();
}

// ─── Inventory ───────────────────────────────────────
export async function getAllInventory() {
  const res = await fetch(`${API_BASE}/inventory`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function addInventoryItem(item: { itemName: string; category: string; quantity: number; threshold?: number }) {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

export async function updateInventoryItem(id: string, data: Partial<{ itemName: string; category: string; quantity: number; threshold: number }>) {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

// ─── Reports ─────────────────────────────────────────
export async function getReportSummary() {
  const res = await fetch(`${API_BASE}/reports/summary`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
}
