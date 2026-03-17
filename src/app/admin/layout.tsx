import AdminNavbar from "@/src/components/AdminNavbar";
import "@/src/app/(public)/globals.css";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white text-black`}>
        <AdminNavbar />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
