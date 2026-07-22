"use client";

import { useState } from "react";

type TestStatus = "idle" | "ping" | "download" | "upload" | "done" | "error";

interface SpeedTestResult {
  ping: number | null;
  jitter: number | null;
  download: number | null;
  upload: number | null;
}

async function measurePing(samples = 10) {
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await fetch("/api/ping", { cache: "no-store" });
    times.push(performance.now() - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const jitter = Math.sqrt(
    times.reduce((sum, t) => sum + (t - avg) ** 2, 0) / times.length
  );
  return { ping: avg, jitter };
}

async function testDownload(sizeMB = 20, onProgress?: (mbps: number) => void) {
  const start = performance.now();
  const res = await fetch(`/api/download?size=${sizeMB}`, { cache: "no-store" });
  const reader = res.body!.getReader();
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed > 0) onProgress?.((received * 8) / elapsed / 1_000_000);
  }

  const totalTime = (performance.now() - start) / 1000;
  return (received * 8) / totalTime / 1_000_000;
}

async function testUpload(sizeMB = 10) {
  const data = new Uint8Array(sizeMB * 1024 * 1024);
  crypto.getRandomValues(data.subarray(0, 65536));
  const start = performance.now();
  await fetch("/api/upload", { method: "POST", body: data });
  const elapsed = (performance.now() - start) / 1000;
  return (data.length * 8) / elapsed / 1_000_000;
}

export function SpeedTestDashboard() {
  const [status, setStatus] = useState<TestStatus>("idle");
  const [liveMbps, setLiveMbps] = useState<number | null>(null);
  const [result, setResult] = useState<SpeedTestResult>({
    ping: null,
    jitter: null,
    download: null,
    upload: null,
  });

  async function runTest() {
    try {
      setResult({ ping: null, jitter: null, download: null, upload: null });
      setLiveMbps(null);

      setStatus("ping");
      const { ping, jitter } = await measurePing();
      setResult((r) => ({ ...r, ping, jitter }));

      setStatus("download");
      const download = await testDownload(20, (mbps) => setLiveMbps(mbps));
      setResult((r) => ({ ...r, download }));
      setLiveMbps(null);

      setStatus("upload");
      const upload = await testUpload(10);
      setResult((r) => ({ ...r, upload }));

      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const isRunning = status !== "idle" && status !== "done" && status !== "error";

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <button
        onClick={runTest}
        disabled={isRunning}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium disabled:opacity-50"
      >
        {isRunning ? "Đang kiểm tra..." : "Bắt đầu Speed Test"}
      </button>

      {status === "download" && liveMbps !== null && (
        <p className="text-sm text-gray-400">
          Đang tải xuống: {liveMbps.toFixed(1)} Mbps
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 text-center">
        <Stat label="Ping" value={result.ping} unit="ms" />
        <Stat label="Jitter" value={result.jitter} unit="ms" />
        <Stat label="Download" value={result.download} unit="Mbps" />
        <Stat label="Upload" value={result.upload} unit="Mbps" />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">Có lỗi xảy ra, vui lòng thử lại.</p>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="rounded-lg border border-gray-700 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">
        {value !== null ? value.toFixed(1) : "--"}{" "}
        <span className="text-sm text-gray-500">{unit}</span>
      </p>
    </div>
  );
}