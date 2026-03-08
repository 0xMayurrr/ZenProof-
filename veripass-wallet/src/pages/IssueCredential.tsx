import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

const IssueCredential = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a document file");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("deid_token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("recipientWallet", recipientWallet);
      formData.append("description", description);
      if (expiryDate) formData.append("expiryDate", expiryDate);
      formData.append("document", file);

      const res = await api.credentials.issue(formData, token);
      if (res.success) {
        toast.success("Credential issued and recorded on-chain!", { icon: <CheckCircle2 className="h-4 w-4 text-success" /> });
        navigate("/credentials");
      } else {
        throw new Error(res.error || "Failed to issue credential");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Issue New Credential</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and sign a verifiable credential for a recipient</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div>
            <Label className="text-sm">Credential Title</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Bachelor of Computer Science" className="mt-1 bg-secondary/50 border-border" />
          </div>

          <div>
            <Label className="text-sm">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1 bg-secondary/50 border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">🎓 Education</SelectItem>
                <SelectItem value="employment">💼 Employment</SelectItem>
                <SelectItem value="certification">📜 Certification</SelectItem>
                <SelectItem value="license">🪪 License</SelectItem>
                <SelectItem value="award">🏆 Award</SelectItem>
                <SelectItem value="other">📄 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Recipient DID or Wallet</Label>
            <Input required value={recipientWallet} onChange={(e) => setRecipientWallet(e.target.value)} placeholder="0x..." className="mt-1 bg-secondary/50 border-border" />
          </div>

          <div>
            <Label className="text-sm">Description</Label>
            <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the credential..." className="mt-1 bg-secondary/50 border-border min-h-[100px]" />
          </div>

          <div>
            <Label className="text-sm">Expiry Date (optional)</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="mt-1 bg-secondary/50 border-border" />
          </div>

          <div>
            <Label className="text-sm">Upload Document</Label>
            <div className="mt-1 relative border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer overflow-hidden">
              <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.png,.jpg,.jpeg" />
              {file ? (
                <div>
                  <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-foreground">{file.name}</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-4 bg-primary/5 border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">What happens next:</strong> The document will be uploaded to IPFS,
              its hash recorded on the blockchain, and the credential sent to the recipient's wallet.
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Issuing & Recording on Chain...</> : "Issue Credential"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default IssueCredential;
