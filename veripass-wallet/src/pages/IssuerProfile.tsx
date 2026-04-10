import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const IssuerProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    website: "",
    description: "",
    email: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("deid_token");
        if (!token) return;
        const res = await api.auth.getMe(token);
        if (res.success) {
          setFormData({
            organizationName: res.data.organizationName || "",
            website: res.data.website || "",
            description: res.data.description || "",
            email: res.data.email || ""
          });
        }
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) return;

      const res = await api.auth.updateMe(formData, token);
      if (res.success) {
        updateUser({ name: formData.organizationName || user?.name, email: formData.email } as any);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Organization Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your issuer organization details</p>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="font-display font-semibold">Verified Issuer</p>
            <p className="text-sm text-muted-foreground">Your organization has been approved to issue credentials</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Organization Details</h2>
          </div>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <>
              <div>
                <Label className="text-sm">Organization Name</Label>
                <Input name="organizationName" value={formData.organizationName} onChange={handleChange} placeholder="Acme University" className="mt-1 bg-secondary/50 border-border" />
              </div>
              <div>
                <Label className="text-sm">Website</Label>
                <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://acme.edu" className="mt-1 bg-secondary/50 border-border" />
              </div>
              <div>
                <Label className="text-sm">Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Leading institution..." className="mt-1 bg-secondary/50 border-border min-h-[100px]" />
              </div>
              <div>
                <Label className="text-sm">Contact Email</Label>
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="credentials@acme.edu" className="mt-1 bg-secondary/50 border-border" />
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IssuerProfile;
