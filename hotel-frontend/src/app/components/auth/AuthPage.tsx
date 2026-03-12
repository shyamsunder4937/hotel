import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { loginUser, registerUser } from "../../api";

interface AuthPageProps {
  onAuth: () => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password, "customer");
      }
      onAuth();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  mode === "login" ? "text-[#d4af37] border-b-2 border-[#d4af37] bg-[#d4af37]/5" : "text-gray-500 hover:text-gray-700"
                }`}>
                Sign In
              </button>
              <button onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  mode === "register" ? "text-[#d4af37] border-b-2 border-[#d4af37] bg-[#d4af37]/5" : "text-gray-500 hover:text-gray-700"
                }`}>
                Create Account
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-3xl text-gray-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {mode === "login" ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="text-gray-500 mb-8">
                {mode === "login" ? "Sign in to manage your bookings" : "Create an account to book rooms"}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {mode === "register" && (
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]" />
                  </div>
                </div>
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full bg-[#d4af37] hover:bg-[#c49d2e] text-black py-3.5 rounded-lg transition-colors text-lg disabled:opacity-50">
                  {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
