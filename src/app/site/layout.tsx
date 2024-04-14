import Navigation from "@/components/modules/landing/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </AuthProvider>
  );
};

export default SiteLayout;
