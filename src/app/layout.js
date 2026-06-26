import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";
import GlobalLoader from "@/components/GlobalLoader";

export const metadata = {
  title: "Forge Pulse",
  description: "Fitness classes and community forum for Forge Pulse.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <GlobalLoader />
        <Navber />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
