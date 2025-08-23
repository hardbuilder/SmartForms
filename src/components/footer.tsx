
"use client";

import { PencilRuler } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <PencilRuler className="h-6 w-6 text-primary" />
            <Link href="/" className="ml-2 text-xl font-bold">
              SmartForms
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SmartForms, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
