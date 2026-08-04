import type { ReactNode } from "react";
import { Suspense } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { BottomNav } from "./BottomNav";
import { MetaPixel } from "./MetaPixel";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MetaPixel />
      <SiteHeader />
      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
      <FloatingWhatsApp />
    </div>
  );
}
