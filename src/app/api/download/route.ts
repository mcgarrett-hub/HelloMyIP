export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sizeMB = Math.min(Number(searchParams.get("size")) || 10, 100);
  const totalBytes = sizeMB * 1024 * 1024;
  const chunkSize = 64 * 1024;

  const stream = new ReadableStream({
    start(controller) {
      let sent = 0;
      const chunk = new Uint8Array(chunkSize);
      crypto.getRandomValues(chunk);

      function push() {
        if (sent >= totalBytes) {
          controller.close();
          return;
        }
        controller.enqueue(chunk);
        sent += chunkSize;
        push();
      }
      push();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store, no-transform",
      "Content-Encoding": "identity",
    },
  });
}