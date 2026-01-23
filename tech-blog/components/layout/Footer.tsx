import Link from "next/link";
import { socialLinks } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        {/* Copyright */}
        <p className="text-xs text-muted-foreground">by itjustbong</p>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
              aria-label={link.label}
            >
              <link.icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
