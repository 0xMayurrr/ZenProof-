import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Shield, Lock, Globe, Zap, Users, Database } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          About <span className="gradient-text">Credora</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Credora is a universal credential wallet that puts ownership of your achievements back in your hands.
          No middlemen. No expiration. Blockchain-verified trust.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Shield, title: "Self-Sovereign Identity", desc: "You own your DID and credentials. No institution can revoke your access to your own records." },
          { icon: Lock, title: "Tamper-Proof", desc: "Document hashes are recorded on blockchain, making any tampering instantly detectable." },
          { icon: Globe, title: "Universal Access", desc: "Works across borders and institutions. Share with anyone, verify from anywhere." },
          { icon: Zap, title: "Instant Verification", desc: "Verifiers can confirm credential authenticity in seconds without contacting issuers." },
          { icon: Users, title: "Multi-Role Ecosystem", desc: "Designed for individuals, issuing organizations, and verifiers with distinct workflows." },
          { icon: Database, title: "Hybrid Storage", desc: "Documents on IPFS, proofs on blockchain, metadata in secure databases. Best of all worlds." },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <item.icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-display font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default About;
