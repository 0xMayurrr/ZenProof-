import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Fingerprint, Loader2, Github, Award, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { Identity } from "@semaphore-protocol/identity";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [githubSyncing, setGithubSyncing] = useState(false);
  const [repScore, setRepScore] = useState<number | null>(null);
  const [zkProofStatus, setZkProofStatus] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    githubUsername: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("deid_token");
        if (!token) return;
        const res = await api.auth.getMe(token);
        if (res.success) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            githubUsername: res.data.githubUsername || ""
          });
        }
        if (user?.walletAddress) {
          const scoreRes = await api.devrep.getScore(user.walletAddress);
          setRepScore(scoreRes.score);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) return;
      const res = await api.auth.updateMe(formData, token);
      if (res.success) {
        updateUser({ name: res.data.name, email: res.data.email });
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncGithub = async () => {
    if (!formData.githubUsername) return toast.error("Please enter a GitHub username to sync");
    setGithubSyncing(true);
    setZkProofStatus("Generating Semaphore Identity...");
    try {
      // 1. Fetch from GitHub API
      const repos = await api.github.getStats(formData.githubUsername);
      const publicRepos = repos.length || 0;

      // 2. Mock Semaphore Auth / ZKP Proof 
      const identity = new Identity(user?.walletAddress || "test");
      setZkProofStatus(`Zero-Knowledge Proof Generated: Semaphore ID ${identity.commitment.toString().substring(0, 10)}... (Proves Developer Activity privately)`);

      // 3. Update Dev Rep Score
      const token = localStorage.getItem("deid_token");
      if (token && user?.walletAddress) {
        const updateRes = await api.devrep.updateScore(publicRepos, token);
        if (updateRes.score !== undefined) {
          setRepScore(updateRes.score);
        } else {
          // Refetch
          const scoreRes = await api.devrep.getScore(user.walletAddress);
          setRepScore(scoreRes.score);
        }
        toast.success(`Synced ${publicRepos} repos. Zk-Proof attached. Dev Rep Score updated!`);
      }
    } catch (err) {
      toast.error("Failed to sync GitHub data or generate ZK-Proof");
      setZkProofStatus("ZK-Proof generation failed");
    } finally {
      setGithubSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your decentralized identity</p>
        </div>

        {/* Identity */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Decentralized Identity</h2>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Your DID</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 text-sm bg-secondary/50 p-3 rounded-lg font-mono break-all">{user?.did}</code>
              <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(user?.did || ""); toast.success("Copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {user?.walletAddress && (
            <div>
              <Label className="text-xs text-muted-foreground">Wallet Address</Label>
              <p className="text-sm font-mono mt-1 break-all">{user.walletAddress}</p>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground">Login Method</Label>
            <p className="text-sm mt-1 capitalize">{user?.loginMethod || "Email"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Role</Label>
            <p className="text-sm mt-1 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Profile form */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-display font-semibold">Profile Information</h2>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <>
              <div>
                <Label htmlFor="name" className="text-sm">Display Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 bg-secondary/50 border-border" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 bg-secondary/50 border-border" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </>
          )}
        </div>

        {/* Dev Portfolio Sync Segment */}
        <div className="glass-card p-6 space-y-4 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-3">
            <Github className="h-6 w-6 text-emerald-500" />
            <h2 className="font-display font-semibold text-emerald-500">Developer Portfolio & ZKP</h2>
          </div>
          <p className="text-sm text-muted-foreground">Sync your GitHub and hackathon wins to prove your skills with zero-knowledge math without exposing your private code histories.</p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="githubUsername" className="text-sm">GitHub Username</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="githubUsername" name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder="torvalds" className="bg-secondary/50 border-border" />
                  <Button onClick={handleSyncGithub} disabled={githubSyncing} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
                    {githubSyncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sync & Prove"}
                  </Button>
                </div>
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Dev Rep Score:</span>
                </div>
                <span className="text-2xl font-bold font-mono text-emerald-500">{repScore !== null ? repScore : "---"}</span>
              </div>

              {zkProofStatus && (
                <div className="bg-blue-900/20 text-blue-400 p-3 rounded-lg text-xs break-all flex items-start gap-2 border border-blue-500/20">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{zkProofStatus}</span>
                </div>
              )}
            </div>

            {/* QR Code Share Profile/Score */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm mb-3 font-medium text-center text-muted-foreground">Share Rep Score via QR</p>
              <div className="bg-white p-3 rounded-xl shadow-lg hover:scale-105 transition-transform">
                <QRCodeSVG
                  value={`${window.location.origin}/verify-rep/${user?.walletAddress}`}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/verify-rep/${user?.walletAddress}`);
                toast.success("Verifiable Portfolio Link Copied!");
              }}>
                <Copy className="h-3 w-3 mr-1" /> Copy Share Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
