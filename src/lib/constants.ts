export type NavItem = {
  href: string;
  label: string;
  labelVi?: string;
  badge?: "mvp" | "soon";
};

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", labelVi: "Trang chủ" },
  { href: "/ip-lookup", label: "IP Lookup", labelVi: "Tra IP", badge: "mvp" },
  { href: "/dns-lookup", label: "DNS Lookup", labelVi: "Tra DNS", badge: "mvp" },
  { href: "/whois", label: "WHOIS", labelVi: "WHOIS", badge: "mvp" },
  { href: "/domain-lookup", label: "Domain Lookup", labelVi: "Tra domain", badge: "soon" },
  { href: "/reverse-dns", label: "Reverse DNS", labelVi: "Reverse DNS", badge: "soon" },
  { href: "/ping", label: "Ping", badge: "soon" },
  { href: "/traceroute", label: "Traceroute", badge: "soon" },
  { href: "/port-checker", label: "Port Checker", badge: "soon" },
  { href: "/blacklist", label: "Blacklist", badge: "soon" },
  { href: "/vpn-proxy", label: "VPN / Proxy", badge: "soon" },
  { href: "/ssl-checker", label: "SSL Checker", badge: "soon" },
  { href: "/http-headers", label: "HTTP Headers", badge: "soon" },
  { href: "/website-down", label: "Website Down", badge: "soon" },
  { href: "/speed-test", label: "Speed Test" },
  { href: "/tools", label: "More Tools", labelVi: "Công cụ khác", badge: "soon" },
  { href: "/blog", label: "Blog", labelVi: "Blog", badge: "mvp" },
  { href: "/api-docs", label: "API", badge: "mvp" },
];

export const DNS_RECORD_TYPES = [
  "A",
  "AAAA",
  "MX",
  "NS",
  "TXT",
  "CNAME",
  "SOA",
  "PTR",
  "SRV",
  "CAA",
] as const;

export type DnsRecordType = (typeof DNS_RECORD_TYPES)[number];

export const BLOG_POSTS = [
  {
    slug: "what-is-an-ip-address",
    title: "What is an IP Address?",
    titleVi: "Địa chỉ IP là gì?",
    excerpt:
      "Learn how IP addresses identify devices on the internet and why they matter for privacy and networking.",
    date: "2026-03-15",
  },
  {
    slug: "ipv4-vs-ipv6",
    title: "IPv4 vs IPv6",
    titleVi: "IPv4 và IPv6",
    excerpt:
      "Compare address space, format, and adoption of IPv4 and IPv6 in modern networks.",
    date: "2026-03-10",
  },
  {
    slug: "what-is-dns",
    title: "What is DNS?",
    titleVi: "DNS là gì?",
    excerpt:
      "Understand how the Domain Name System translates human-readable names into IP addresses.",
    date: "2026-03-05",
  },
  {
    slug: "how-vpn-works",
    title: "How VPN Works",
    titleVi: "VPN hoạt động thế nào",
    excerpt:
      "A practical overview of VPN tunnels, encryption, and what changes when you connect.",
    date: "2026-02-28",
  },
] as const;
