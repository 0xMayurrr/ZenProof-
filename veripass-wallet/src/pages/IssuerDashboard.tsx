import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FilePlus, CheckCircle2, XCircle, Loader2, Copy, ExternalLink, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";

const IssuerDashboard = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("deid_token");
        if (!token) return;
        const res = await api.credentials.getIssued(token);
        if (res.success) setCredentials(res.data);
      } catch { toast.error("Failed to load credentials"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this credential? This cannot be undone.")) return;
    setRevoking(id);
    try {
      const token = localStorage.getItem("deid_token");
      await api.credentials.revoke(id, token!);
      setCredentials(prev => prev.map(c => c._id === id ? { ...c, revoked: true } : c));
      toast.success("Credential revoked on-chain");
    } catch { toast.error("Failed to revoke"); }
    finally { setRevoking(null); }
  };

  const active = credentials.filter(c => !c.revoked).length;
  const revoked = credentials.filter(c => c.revoked).length;
  const uniqueRecipients = new Set(credentials.map(c => c.recipientWallet)).size;

  const filtered = credentials.filter(c =>
    (c.title?.toLowerCase().includes(search.toLowerCase())) ||
    (c.recipientWallet?.toLowerCase().includes(search.toLowerCase())) ||
    (c.recipientId?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Welcome, <span className="gradient-text">{user?.organizationName || user?.name}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground font-mono">{user?.did || user?.walletAddress}</span>
              <button onClick={() => { navigator.clipboard.writeText(user?.did || user?.walletAddress || ""); toast.success("Copied!"); }}>
                <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
          <Link to="/issuer/issue">
            <Button className="gap-2 bg-primary"><FilePlus className="h-4 w-4" /> Issue Credential</Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, label: "Total Issued", value: credentials.length, accent: true },
            { icon: CheckCircle2, label: "Active", value: active },
            { icon: Users, label: "Recipients", value: uniqueRecipients },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                  <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              <div className="font-display text-2xl font-bold">{loading ? "..." : value}</div>
            </div>
          ))}
        </div>

        {/* Issued Credentials Table */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h2 className="font-display font-semibold">Issued Credentials</h2>
            <Input
              placeholder="Search by title, recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-secondary/50 border-border text-sm h-8"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {credentials.length === 0 ? "No credentials issued yet." : "No results found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-xs">
                    <th className="text-left px-5 py-3 font-medium">Credential</th>
                    <th className="text-left px-5 py-3 font-medium">Recipient</th>
                    <th className="text-left px-5 py-3 font-medium">Issued</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Tx</th>
                    <th className="text-left px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map((c) => (
                    <tr key={c._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{c.category}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{c.recipientId?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground font-mono">{c.recipientWallet?.substring(0, 14)}...</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(c.issuedAt || c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.revoked ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                          {c.revoked ? "Revoked" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {c.blockchainTxHash ? (
                          <a href={`https://sepolia.etherscan.io/tx/${c.blockchainTxHash}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-xs">
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        {!c.revoked ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs gap-1"
                            disabled={revoking === c._id}
                            onClick={() => handleRevoke(c._id)}
                          >
                            {revoking === c._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                            Revoke
                          </Button>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IssuerDashboard;
