# HelloMyIP

Website kiểu WhatIsMyIP — xem IP công khai, tra IP/DNS/WHOIS, blog SEO, và JSON API.

## Yêu cầu

- Node.js 20+
- npm hoặc pnpm

## Chạy local

```bash
cd C:\Users\khoan\Projects\HelloMyIP
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## MVP đã có

| Tính năng | Route |
|-----------|--------|
| Trang chủ (IP, ISP, geo, browser, headers, WebRTC) | `/` |
| IP Lookup | `/ip-lookup` |
| DNS Lookup (A, AAAA, MX, …) | `/dns-lookup` |
| WHOIS (RDAP) | `/whois` |
| Blog | `/blog` |
| API docs | `/api-docs` |

### API

- `GET /api/ip` — IP của bạn hoặc `?q=8.8.8.8`
- `GET /api/dns?name=google.com&type=A` hoặc `&all=1`
- `GET /api/whois?q=google.com`
- `GET /api/ping` — placeholder MVP

## Nguồn dữ liệu (MVP)

- Geo IP: [ip-api.com](http://ip-api.com) (non-commercial; cân nhắc bản pro/self-host cho production)
- DNS: Google Public DNS JSON (`dns.google`)
- WHOIS: RDAP qua `rdap.org`

## Roadmap (trong sidebar “Soon”)

Ping ICMP, traceroute, port scan, blacklist, SSL checker, speed test, domain lookup đầy đủ, và các công cụ encoder/calculator.

## Production

1. Deploy lên Vercel / VPS với `npm run build && npm start`
2. Đặt `metadataBase` trong `src/app/layout.tsx` thành domain thật
3. Bật reverse proxy headers (`X-Forwarded-For`, `CF-Connecting-IP`) để IP client chính xác
4. Thay ip-api bằng MaxMind, IPinfo, hoặc DB self-host nếu traffic cao

## Cấu trúc

```
src/app/          — pages & API routes
src/components/   — UI
src/lib/          — ip, dns, whois, blog
content/blog/     — markdown bài viết
```
