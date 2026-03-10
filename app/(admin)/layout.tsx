import AdminSidebar from "@/components/admin/AdminSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-zinc-100 md:flex">
          <AdminSidebar />
          <main className="min-w-0 flex-1 p-3 pt-16 md:p-6 md:pt-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}