import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogOut, Monitor, Globe, Clock, ShieldAlert, MapPin, LayoutTemplate } from "lucide-react";

async function getVisitors() {
  const firebaseUrl = process.env.FIREBASE_DATABASE_URL || "https://portfolio-visitores-tracker-default-rtdb.firebaseio.com/";
  const endpoint = firebaseUrl.endsWith('/') ? `${firebaseUrl}visitors.json` : `${firebaseUrl}/visitors.json`;
  
  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data) return [];
    
    // Firebase returns an object with unique keys. Convert to array.
    const visitors = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    
    // Sort by timestamp descending (newest first)
    return visitors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Failed to fetch visitors:", error);
    return [];
  }
}

export default async function AdminDashboard() {
  // Check Authentication
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session) {
    redirect("/login");
  }

  const visitors = await getVisitors();

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/50 backdrop-blur-md border border-border p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Visitor Tracking & Analytics</p>
          </div>
          
          <form action={async () => {
            "use server";
            const cookieStore = await cookies();
            cookieStore.delete("admin_session");
            redirect("/login");
          }}>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card/50 backdrop-blur-md border border-border p-6 rounded-2xl">
            <h3 className="text-muted-foreground font-semibold mb-2">Total Visits</h3>
            <p className="text-4xl font-black text-primary">{visitors.length}</p>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 font-semibold text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location / IP</div>
                  </th>
                  <th className="p-4 font-semibold text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2"><Monitor className="w-4 h-4" /> Device / OS</div>
                  </th>
                  <th className="p-4 font-semibold text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Browser</div>
                  </th>
                  <th className="p-4 font-semibold text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Time (PKT)</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {visitors.length > 0 ? (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">{visitor.location || "Unknown Location"}</span>
                          <span className="text-xs font-mono text-muted-foreground">{visitor.ip || "Unknown IP"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground/90">{visitor.device || "Unknown Device"}</span>
                          <span className="text-xs text-muted-foreground">{visitor.os || "Unknown OS"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-foreground/80">{visitor.browser || "Unknown Browser"}</span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {visitor.visitedAt || new Date(visitor.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No visitors tracked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
