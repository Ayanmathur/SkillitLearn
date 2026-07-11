import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Layout for public/main pages - includes sticky header and footer.
 * Auth pages (login/signup) use a separate layout without these.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
