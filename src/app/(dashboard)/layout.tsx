import { MissingEnvBanner } from "@/components/setup/missing-env-banner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <MissingEnvBanner />
      {children}
    </div>
  );
}
