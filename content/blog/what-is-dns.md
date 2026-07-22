---
title: What is DNS?
date: 2026-03-05
excerpt: How domain names become IP addresses.
---

The **Domain Name System (DNS)** is the phone book of the internet. Humans type `google.com`; DNS returns IP addresses and other records so connections can be made.

## Common record types

- **A** — IPv4 address
- **AAAA** — IPv6 address
- **MX** — mail servers
- **NS** — authoritative nameservers
- **TXT** — verification strings, SPF, DKIM, etc.

## Resolution path

1. Your device asks a **recursive resolver** (often your ISP or `8.8.8.8`).
2. The resolver walks the hierarchy from root → TLD → authoritative nameserver.
3. Answers are cached according to **TTL** (time to live).

Use HelloMyIP’s [DNS Lookup](/dns-lookup) to inspect records for any domain.
