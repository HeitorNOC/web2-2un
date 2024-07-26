import type { Metadata } from "next";
import { Roboto_Mono as Mono } from "next/font/google";
import "./globals.css";

const mono = Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | WEB 2 PROJECT",
    default: "WEB 2 PROJECT",
  },
  description:
    "Web 2 gym system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className={mono.className}>{children}</body>
    </html>
  );
}
