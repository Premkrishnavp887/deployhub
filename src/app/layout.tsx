import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeployHub — Local Deployment Management",
  description: "Manage applications, servers, targets, and deployments powered by Jenkins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full min-h-screen text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-700">
        {children}
      </body>
    </html>
  );
}
