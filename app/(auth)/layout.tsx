import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div
          className="pointer-events-none absolute inset-0 -z-10
          bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]
          bg-size-[25px_25px]
          mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
          [-webkit-mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        />
          <Navbar/>
          {children}
      </body>
    </html>
  );
}