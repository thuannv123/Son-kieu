"use client";

import { usePathname } from "next/navigation";
import Navbar               from "./Navbar";
import Footer               from "./Footer";
import TicketCheckerWidget  from "./TicketCheckerWidget";
import ScrollToTopButton    from "./ScrollToTopButton";
import ZaloButton           from "./ZaloButton";
import PageTransition       from "./PageTransition";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin   = pathname.startsWith("/admin");
  const isBooking = pathname.startsWith("/booking");

  return (
    <>
      {!isAdmin && <Navbar />}
      <PageTransition>{children}</PageTransition>
      {!isAdmin && <Footer />}
      {!isAdmin && !isBooking && <TicketCheckerWidget />}
      {!isAdmin && <ZaloButton />}
      {!isAdmin && <ScrollToTopButton />}
    </>
  );
}
