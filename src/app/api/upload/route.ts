export const runtime = 'edge';

export async function POST(req: Request) {
  const reader = req.body?.getReader();
  let received = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value?.length ?? 0; // chỉ đếm, không lưu
    }
  }
  return Response.json({ receivedBytes: received });
}