---
title: IPv4 vs IPv6
date: 2026-03-10
excerpt: Compare address formats and when each protocol is used.
---

IPv4 has been the backbone of the internet for decades, but IPv6 adoption continues to grow as more networks enable dual-stack connectivity.

## Format

| Version | Example |
|---------|---------|
| IPv4 | `8.8.8.8` |
| IPv6 | `2001:4860:4860::8888` |

## Dual stack

Many ISPs now assign both IPv4 and IPv6. Your browser may prefer IPv6 when the destination supports it. HelloMyIP shows IPv4 from geo APIs by default; IPv6 detection depends on your hosting proxy forwarding `X-Forwarded-For` or similar headers.

## NAT and IPv6

IPv4 often relies on **NAT** at home routers. IPv6 was designed so every device can have a globally routable address, though privacy extensions and firewall rules still matter.
