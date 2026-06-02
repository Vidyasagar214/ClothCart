import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 text-center px-4">
      <p className="font-display text-8xl font-bold gradient-text mb-4">404</p>
      <h1 className="font-display text-2xl font-bold mb-3">Page Not Found</h1>
      <p className="text-slate-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/"><Button size="lg">Back to Home</Button></Link>
    </div>
  );
}
