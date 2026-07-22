import { SpeedTestDashboard } from "@/components/speedtest/speedtest-dashboard";
import { PageShell } from "@/components/layout/site-chrome";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <PageShell
      activeHref="/speed-test"
      title="Speed Test"
      description="Kiểm tra tốc độ download, upload và ping của kết nối mạng bạn đang dùng."
    >
      <SpeedTestDashboard />
    </PageShell>
  );
}