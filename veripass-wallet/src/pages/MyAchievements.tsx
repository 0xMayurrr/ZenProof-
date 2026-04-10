import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2, Trophy, Plus, X } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { categoryIcons } from "@/lib/mock-data";

const MyAchievements = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("deid_token");
        if (!token) return;
        const res = await api.credentials.getAll(token);
        if (res.success) {
          // Filter only self-issued (where issuerId matches self or no org name)
          setAchievements(res.data.filter((c: any) => c.category === "achievement" || !c.issuerId?.organizationName));
        }
      } catch { } finally { setLoading(false); }
    };
    fetchAchievements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please upload a document"); return; }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) throw new Error("Not authenticated");

      // Self-issue: recipient is yourself
      const meRes = await api.auth.getMe(token);
      const myWallet = meRes.data?.walletAddress;
      if (!myWallet) throw new Error("Wallet not found");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category || "achievement");
      formData.append("recipientWallet", myWallet);
      formData.append("description", description);
      formData.append("document", file);

      const res = await api.credentials.issue(formData, token);
      if (res.success) {
        toast.success("Achievement verified and stored on-chain!");
        setShowForm(false);
        setTitle(""); setCategory(""); setDescription(""); setFile(null);
        // Refresh
        const updated = await api.credentials.getAll(token);
        if (updated.success) setAchievements(updated.data);
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify achievement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">My Achievements</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload and verify your personal achievements on-chain</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-primary">
            {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Achievement</>}
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4 border-primary/20">
            <h2 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Verify New Achievement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm">Achievement Title</Label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Hackathon Winner, AWS Certified..." className="mt-1 bg-secondary/50 border-border" />
              </div>
              <div>
                <Label className="text-sm">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1 bg-secondary/50 border-border"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="award">🏆 Award</SelectItem>
                    <SelectItem value="certification">📜 Certification</SelectItem>
                    <SelectItem value="education">🎓 Education</SelectItem>
                    <SelectItem value="other">📄 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Description</Label>
                <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your achievement..." className="mt-1 bg-secondary/50 border-border min-h-[80px]" />
              </div>
              <div>
                <Label className="text-sm">Upload Proof Document</Label>
                <div className="mt-1 relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer overflow-hidden">
                  <input type="file" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.png,.jpg,.jpeg" />
                  {file ? (
                    <div><CheckCircle2 className="h-6 w-6 text-success mx-auto mb-1" /><p className="text-sm">{file.name}</p></div>
                  ) : (
                    <div><Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" /><p className="text-sm text-muted-foreground">Upload certificate, screenshot, or PDF</p></div>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary h-11 gap-2">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying on-chain...</> : "Verify & Store Achievement"}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Achievements list */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : achievements.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No achievements yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{categoryIcons[c.category as keyof typeof categoryIcons] || "🏅"}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.revoked ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                    {c.revoked ? "Revoked" : "Verified"}
                  </span>
                </div>
                <h3 className="font-medium mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(c.issuedAt || c.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAchievements;
