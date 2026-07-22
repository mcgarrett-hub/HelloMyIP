---
title: How VPN Works
date: 2026-02-28
excerpt: Tunnels, encryption, and what changes when you connect.
---

A **VPN (Virtual Private Network)** creates an encrypted tunnel between your device and a VPN server. Traffic exits to the internet from the VPN server’s IP, not your home ISP IP.

## What changes

- Websites see the **VPN exit IP** and the VPN provider’s ASN.
- Your ISP sees encrypted traffic to the VPN endpoint, not final destinations.

## Detection

Datacenter IP ranges, DNS leaks, and WebRTC local IP exposure can reveal VPN or proxy use. HelloMyIP shows heuristic **proxy/hosting** flags from geo databases—useful but not perfect.

## Legitimate uses

Remote work, privacy on untrusted Wi‑Fi, and accessing geo-restricted resources (where legal) are common reasons people use VPNs.
