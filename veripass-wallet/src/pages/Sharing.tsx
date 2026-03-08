import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Sharing = () => {
  const [shares, setShares] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedCred, setSelectedCred] = useState("");
  const [expiresIn, setExpiresIn] = useState("30");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchCreds = async () => {
      try {
        const token = localStorage.getItem("deid_token");
        if (!token) return;

        const [credsRes, sharesRes] = await Promise.all([
          api.credentials.getAll(token),
          api.shares.getAll(token)
        ]);

        if (credsRes.success) {
          setCredentials(credsRes.data.filter((c: any) => !c.revoked));
        }
        if (sharesRes.success) {
          setShares(sharesRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreds();
  }, []);

  const downloadQR = (id: string, title: string) => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${title.replace(/\s+/g, "_")}_QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCreateShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCred) return toast.error("Please select a credential");
    setIsCreating(true);
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) return;
      const res = await api.shares.create(selectedCred, parseInt(expiresIn), token);
      if (res.success) {
        toast.success("Share link created!");
        setOpenCreate(false);
        // Refresh shares
        const updatedShares = await api.shares.getAll(token);
        setShares(updatedShares.success ? updatedShares.data : []);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create share");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeShare = async (id: string) => {
    if (!confirm("Revoke this share link? Anyone with the link will lose access.")) return;
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) return;
      await api.shares.revoke(id, token);
      toast.success("Share link revoked");
      setShares(s => s.filter(share => share._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke share");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-2xl font-bold">Sharing Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Create and manage shareable links for your active credentials.</p>
          </div>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">Create Share Link</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share a Credential</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateShare} className="space-y-4 pt-4">
                <div>
                  <Label>Select Credential</Label>
                  <Select value={selectedCred} onValueChange={setSelectedCred} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose one..." />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials.map(c => (
                        <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Link Expiry</Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Expires in..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Generate Link & QR
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : shares.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground">
            You haven't shared any credentials yet. Click 'Create Share Link' to start.
          </div>
        ) : (
          <div className="glass-card divide-y divide-border/50">
            {shares.map((share) => {
              const verifyUrl = `${window.location.origin}/verify?token=${share.token}`;
              const isExpired = new Date(share.expiresAt) < new Date();
              const expiresStr = new Date(share.expiresAt).toLocaleDateString();
              const credTitle = share.credentialId?.title || "Unknown Credential";

              return (
                <div key={share._id} className={`p-5 flex flex-col sm:flex-row sm:items-center gap-6 justify-between ${isExpired ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="p-3 bg-white rounded-xl shadow-sm shrink-0 md:mb-0 mb-4">
                      <QRCodeSVG id={`qr-${share._id}`} value={verifyUrl} size={160} level="M" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{credTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">Views: {share.accessLogs?.length || 0}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className={`${isExpired ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"} px-2 py-0.5 rounded-full font-medium`}>
                          {isExpired ? "Expired" : "Active"}
                        </span>
                        <span>Expires: {expiresStr}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {!isExpired && (
                      <>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadQR(share._id, credTitle)}>
                          <Download className="h-4 w-4" /> QR
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => { navigator.clipboard.writeText(verifyUrl); toast.success("Share link copied!"); }}>
                          <Copy className="h-4 w-4" /> Link
                        </Button>
                      </>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleRevokeShare(share._id)}>
                      Revoke
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Sharing;
