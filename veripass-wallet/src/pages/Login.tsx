import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Wallet, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login, loginWithWallet, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch { toast.error("Login failed"); }
  };

  const handleWallet = async () => {
    try {
      await loginWithWallet();
      toast.success("Wallet connected!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Wallet connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <img src="/credora-high-resolution-logo-transparent.png" alt="Credora" className="h-8 logo-filter" />
        </Link>

        <h1 className="font-display text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Sign in to access your credential wallet</p>

        <Button
          variant="outline"
          className="w-full mb-6 gap-2 border-border hover:bg-secondary h-12"
          onClick={handleWallet}
          disabled={isLoading}
        >
          <Wallet className="h-4 w-4" />
          Connect MetaMask
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with email</span></div>
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 bg-secondary/50 border-border" />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 bg-secondary/50 border-border" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 gap-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Sign In
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
