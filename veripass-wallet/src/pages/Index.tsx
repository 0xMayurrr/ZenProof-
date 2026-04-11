import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Shield, Fingerprint, Lock, CheckCircle2, ArrowRight, Github, Award, Star, BookOpen, Clock, Users, ShieldCheck, Globe, GitCommit, Wallet, Share2, Award as BadgeCheck } from "lucide-react";

// Helper animation
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-16 xl:px-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text */}
          <motion.div
            className="flex-1 max-w-2xl lg:pr-8 xl:pr-16"
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="h-4 w-4" /> Decentralized Credential Wallet
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Own your <br />
              <span className="gradient-text">Digital Identity</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8 max-w-xl">
              Store, manage, and share your life achievements on the blockchain. Generate a completely decentralized DID. Prove your credentials and Dev Rep with Zero-Knowledge without relying on centralized middlemen.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-14 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all">
                  Create Portfolio <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/verify">
                <Button size="lg" variant="outline" className="text-base px-8 h-14 rounded-xl border-border hover:bg-secondary">
                  Scan QR Code
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Graphic (Static, High-Tech Web3 Wallet Mockup - Visible on Mobile too) */}
          <motion.div
            className="flex-1 relative w-full mt-10 lg:mt-0"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto min-h-[400px] sm:aspect-[4/5] rounded-[2.5rem] bg-secondary/30 border border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl flex flex-col">

              {/* Top Bar */}
              <div className="h-12 bg-background/80 border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="mx-auto bg-background/60 text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-3 py-1 rounded-md border border-border/50">
                  Veripass Wallet
                </div>
              </div>

              {/* Holographic Verification Body */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
                {/* Background scanning line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 shadow-[0_0_20px_rgba(20,184,166,0.6)]" />

                <div className="w-32 h-32 mb-6 relative">
                  {/* Decorative glowing QR box */}
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-xl flex items-center justify-center bg-primary/5">
                    <Fingerprint className="w-12 h-12 text-primary/80" />
                  </div>
                  {/* Corner markers */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-bold text-foreground">Identity Verified</h3>
                  <p className="text-sm text-emerald-400 font-mono mt-1">Zero-Knowledge Proof Valid</p>
                </div>

                {/* Cryptographic Log Window */}
                <div className="w-full bg-background border border-border rounded-lg p-3 font-mono text-[10px] text-muted-foreground break-all shadow-inner space-y-1">
                  <div className="flex gap-2"><span className="text-primary">{'>'}</span><span>verify_proof(snark_v1)</span></div>
                  <div className="flex gap-2"><span className="text-primary">{'>'}</span><span className="text-emerald-500">true</span></div>
                  <div className="flex gap-2"><span className="text-primary">{'>'}</span><span>hash: 0x7fa9...8c2b</span></div>
                  <div className="flex gap-2"><span className="text-primary">{'>'}</span><span>status: synchronized</span></div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Partners Logostrip */}
      <section className="py-6 sm:py-8 border-y border-border/40 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-4 sm:mb-6">Powered By Next-Gen Web3 Infrastructure</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-lg"><Globe className="h-4 w-4 sm:h-5 sm:w-5" /> Ethereum</div>
            <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-lg"><Lock className="h-4 w-4 sm:h-5 sm:w-5" /> IPFS</div>
            <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-lg"><ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" /> Semaphore ZK</div>
            <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-lg"><Github className="h-4 w-4 sm:h-5 sm:w-5" /> GitHub</div>
          </div>
        </div>
      </section>

      {/* 3. Feature 1: The Dev Portfolio (Matches "Hold/Portfolio" feature in image) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="flex-1">
              <div className="text-emerald-500 text-sm font-bold tracking-widest uppercase mb-4">Architecture</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">Secure your entire <br />identity on-chain</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                We generate a permanent Decentralized Identifier (DID) for your wallet. Receive official degrees, bootcamp certificates, and job verifications from authorized organizations perfectly hashed on the Ethereum blockchain.
              </p>
              <ul className="space-y-5 mb-8">
                {['Immutable Credential Vault via MetaMask', 'Zero-Knowledge Proofs for Total Privacy', 'Hackathon Dev Rep Score included natively', 'One-Click QR Code Sharing'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 w-full max-w-lg">
              <div className="glass-card p-8 border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-card overflow-hidden">
                <h3 className="font-display text-lg font-semibold mb-6 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Trusted Issuers Network</h3>
                <div className="space-y-3 relative">
                  {/* Background chart mockup */}
                  <div className="absolute opacity-10 right-0 top-0 bottom-0 w-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwPjxwYXRoIGQ9Ik0wIDUwIEMgMjAgNjAgNDAgMjAgNjAgNDAgQyA4MCA2MCAxMDAgMjAgMTAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSI0Ii8+PC9zdmc+')] bg-no-repeat bg-right-bottom" />

                  {['University of Web3', 'Global DAO Hackathon', 'Google Cloud Certified'].map((repo, i) => (
                    <div key={i} className="p-4 bg-secondary/30 rounded-xl flex justify-between items-center text-sm border border-border/40 hover:bg-secondary/60 transition-colors">
                      <span className="font-medium text-foreground flex items-center gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${i === 0 ? 'bg-primary/20 text-primary' : i === 1 ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                          {i === 0 ? <BookOpen className="w-4 h-4" /> : i === 1 ? <Github className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                        </div>
                        {repo}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold"><CheckCircle2 className="w-4 h-4" /></span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto py-8 sm:py-10 px-4 sm:px-6 rounded-3xl bg-card border border-border/30 shadow-lg">
            <div className="text-center flex flex-col items-center">
              <div className="text-3xl sm:text-5xl font-bold text-emerald-400 font-display mb-2 drop-shadow-sm">50K+</div>
              <div className="text-xs sm:text-sm text-foreground font-medium uppercase tracking-wider">Credentials</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="text-3xl sm:text-5xl font-bold text-emerald-400 font-display mb-2 drop-shadow-sm">24/7</div>
              <div className="text-xs sm:text-sm text-foreground font-medium uppercase tracking-wider">Verification</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="text-3xl sm:text-5xl font-bold text-emerald-400 font-display mb-2 drop-shadow-sm">100+</div>
              <div className="text-xs sm:text-sm text-foreground font-medium uppercase tracking-wider">Institutions</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="text-3xl sm:text-5xl font-bold text-emerald-400 font-display mb-2 drop-shadow-sm">$0</div>
              <div className="text-xs sm:text-sm text-foreground font-medium uppercase tracking-wider">Gas Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Wide Full-Width Banner */}
      <section className="py-16 bg-card text-foreground border-y border-border">
        <div className="container mx-auto px-4 text-center flex flex-col items-center justify-center space-y-6 md:flex-row md:space-y-0 md:justify-between max-w-6xl">
          <div className="text-left">
            <h2 className="font-display text-3xl font-bold mb-2">ZENPROOF powered by ZK Blockchain</h2>
            <p className="text-muted-foreground">The most advanced privacy protocol built for Web3 professionals.</p>
          </div>
          <Link to="/signup">
            <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold px-10 h-14 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* 5. 3 Column Support Area (Matches Bottom Image layout) */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          {/* Faint connecting line mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
            <div className="text-center p-8 bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all shadow-lg flex flex-col items-center">
              <div className="h-14 w-14 bg-card border border-border rounded-full flex items-center justify-center text-primary mb-6 shadow-inner"><Clock className="h-6 w-6" /></div>
              <h3 className="font-bold text-xl mb-3">Instant Output</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Recruiters scan your exclusive QR code to instantly verify your blockchain score without logins.</p>
            </div>
            <div className="text-center p-8 bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all shadow-lg flex flex-col items-center">
              <div className="h-14 w-14 bg-card border border-border rounded-full flex items-center justify-center text-primary mb-6 shadow-inner"><Users className="h-6 w-6" /></div>
              <h3 className="font-bold text-xl mb-3">Communities</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Join Developer DAOs and physical tech hackathons to automatically accumulate verifiable badges.</p>
            </div>
            <div className="text-center p-8 bg-card rounded-3xl border border-border/50 hover:border-primary/30 transition-all shadow-lg flex flex-col items-center">
              <div className="h-14 w-14 bg-card border border-border rounded-full flex items-center justify-center text-primary mb-6 shadow-inner"><BookOpen className="h-6 w-6" /></div>
              <h3 className="font-bold text-xl mb-3">Academy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Learn how ZK Proofs and Ethereum smart contracts govern your identity natively on the protocol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 bg-card/30 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <img src="/logo__334-removebg-preview.png" alt="ZENPROOF" className="h-36 logo-filter mb-6" />
              <p className="text-muted-foreground max-w-xs leading-relaxed">Connect your Web3 Developer Identity. Verifiably showcase your achievements without compromising on privacy.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Help</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
                <li><Link to="/support" className="hover:text-primary transition">Terms of Service</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link to="/verify" className="hover:text-primary transition">Verify Portal</Link></li>
                <li><Link to="/login" className="hover:text-primary transition">Login</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Get App</h4>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-[140px] justify-start gap-2 bg-background"><Github className="h-4 w-4" /> Github Repo</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-xs">
            <p>Copyright © 2026 ZENPROOF Networks.</p>
            <div className="flex gap-4 mb-4 md:mb-0">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition cursor-pointer"><Github className="w-4 h-4" /></div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition cursor-pointer"><Globe className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default Index;
