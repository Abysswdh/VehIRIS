import type { Metadata } from "next";
import { LoginView } from "@/components/views/LoginView";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the VehIRIS inspector workspace for AI-assisted vehicle inspections.",
};

export default function LoginPage() {
  return <LoginView />;
}
