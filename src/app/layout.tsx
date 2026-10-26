import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "VehIRIS — Vehicle Image Recognition & Inspection System",
    template: "%s · VehIRIS",
  },
  description:
    "VehIRIS is an AI-assisted vehicle inspection workspace for rental operations: detect scratches and dents, keep inspectors in the loop, and generate digital reports.",
  applicationName: "VehIRIS",
};

export const viewport: Viewport = {
  themeColor: "#121722",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
