---
title: Tools
seo_title: "WebSSH Tools: Ping, DNS, Whois, Certificates, Postmaster, HTTP Forge, Baker and More"
description: "Reference of the sysadmin tools built into WebSSH for iPhone, iPad and Mac: what each one does, what is free and what is PRO, which ones work as Shortcuts actions, and which servers they talk to."
---

# Tools
Besides terminals and file browsers, WebSSH ships a toolbox for the daily chores of a sysadmin: network diagnostics, DNS and certificate checks, an e-mail deliverability audit, an HTTP client, data transformation, code generation. They open from the **Tools** tile of the sidebar, on iPhone, iPad and Mac.

## The Tools screen
- Tools are grouped in **Network Tools** and **Other tools**, sorted by name, with a search field that also matches aliases such as `dig`, `nslookup`, `nmap`, `curl`, `cyberchef` or `xxd`.
- **All / Favorites / Recents** segments. Long press a tool to add it to your favorites, or to **Pin to Sidebar**: a pinned tool gets its own row in the sidebar, under a *Tools* header, with its attention badge. Pins are kept on the device, not synced.
- On the Mac, the most used tools are also in the **Tools** menu of the menu bar, with `⌃⌥⌘` shortcuts: `A` Addresses, `D` DNS Lookup, `P` Ping, `T` Traceroute, `W` Whois, `E` Certificate Checker, `O` Postmaster, `M` mashREPL, `X` Text Editor, `B` Web Browser, `S` Serial Port.
- Every tool is usable in the FREE version. Where a limit applies, it is listed below; [WebSSH PRO](/documentation/pricing/) removes it.

## Network tools
### Addresses
Your public and private IPv4 and IPv6 addresses, with a refresh button. Long press an address to copy it or run a Whois on it. The public address is obtained by asking an OpenDNS resolver for `myip.opendns.com`, so the only parties that see the request are Cloudflare or Google (to find the resolver) and OpenDNS.

Shortcuts: **Get IP Address** (public or local, IPv4 or IPv6), runs without opening the app. Siri: *"Get my IP address with WebSSH"*.

### Ping
ICMP echo once a second until you stop it, with the reply size, sequence number and round-trip time of every packet. Scope **Auto**, **IPv4** or **IPv6**; a raw IPv4 address is always pinged over IPv4 to avoid NAT64 detours. Long press a reply to copy the IP.

### Traceroute
Lists every hop to the host, up to 50, with its IP, reverse DNS name and latency. Same Auto / IPv4 / IPv6 scope as Ping. Long press a hop to copy it or run a Whois on it.

### DNS Lookup
Resolves **A, AAAA, MX, NS, PTR, SOA, SRV and TXT** records, with their TTL. Queries use the system resolvers and fall back to Cloudflare, Google and Quad9. Append `@dns-server` to the name, `example.com@ns1.example.net`, to ask a specific server.

**Propagation** sends the same query to public resolvers around the world at once and tells you whether they agree: majority answer, divergent answers, no response, with the latency of each resolver. Four resolvers in the FREE version, 29 with PRO.

FREE shows the first 3 records of a lookup. Shortcuts: **DNS Lookup** (host, record type, optional resolver), runs without opening the app.

### Whois
Registration details of a domain or an IP address. Domains are queried over RDAP first, with a fallback to the classic WHOIS port for the TLDs that lack it, so almost every TLD is covered. IPs go to the right regional registry (ARIN, RIPE, APNIC, LACNIC, AFRINIC). The formatted view shows creation, update and expiry dates, transfer locks, DNSSEC, nameservers and contacts; the raw view shows the server answer. A domain that returns nothing is reported as *available*.

Shortcuts: **Domain Whois**, returns the registrar, dates, statuses and nameservers without opening the app.

### Certificate Checker
Watches the TLS certificate of a `host:port` (443 by default): subject, issuer, validity dates and days left, serial, SHA-256 fingerprint, subject alternative names, the full chain, TLS version and cipher suite, and whether the chain is trusted by the system. Expired or invalid certificates are still fetched so you can inspect them. An **Events** tab logs renewals, issuer changes, expirations and failed checks for 180 days.

FREE watches 1 host, checked when you ask. PRO watches as many as you want, re-checks them in the background and sends a notification 30, 14, 7, 3 or 1 days before expiry. Watched hosts sync with iCloud; events stay on the device.

### Postmaster
An e-mail deliverability audit of a domain, in five checks you can enable individually:

- **SPF**: the full include tree, the 10-lookup limit, void lookups, and a tester that tells what a given sending IP would get (pass, fail, softfail…).
- **DKIM**: probes 19 common selectors (`default`, `google`, `selector1`, `k1`, `dkim`, `zoho`, `pm`…) plus the ones you add, and flags revoked or test-mode keys.
- **DMARC**: every tag of the record, including `np`, `psd` and the `t` test-mode tag, with the inherited organizational policy when the subdomain has none.
- **Blacklists**: the MX addresses against 22 DNS blacklists (Spamhaus ZEN, SpamCop, Barracuda, SORBS, UCEPROTECT…).
- **SMTP**: connects to the three best MX hosts on port 25, times the banner, EHLO and STARTTLS stages, and checks the certificate and the reverse DNS of each IP. Port 25 is often blocked on home and mobile networks; Postmaster says so when it is.

Reports can be copied or shared as text or Markdown. FREE audits 1 domain. Domains and their last report sync with iCloud.

### Network Scanner
**Port Scan** probes a host for the top 100 or top 1000 ports, or a custom list such as `22,80,443,8000-8100`, and names the services found; web ports offer *Open in browser*. **Discover Hosts** sweeps a subnet (your local one by default, up to 1024 addresses) by probing a few TCP ports, and names the hosts found through reverse DNS and Bonjour. Tap a host to port-scan it. FREE shows the first 3 results of a scan.

### Subnet Calculator
Type a CIDR, an address with a mask, or a bare IP, in IPv4 or IPv6: network and broadcast addresses, first and last usable host, subnet and wildcard masks, counts, binary representations, address class (private, CGNAT, link-local, ULA…). Tap a bit to flip it, test whether an IP belongs to the subnet, and see where the block sits on a Hilbert map of the IPv4 space. Fully offline.

Shortcuts: **Calculate Subnet**, runs without opening the app.

## Other tools
### Baker Toolkit
A data transformation kitchen inspired by CyberChef: chain operations into a recipe and bake an input through it. Encoding (Base64, Base32, hex, URL, HTML entities, binary, charcode, ROT13, JWT decode), hashing (MD5, SHA-1, SHA-2, HMAC), AES encryption, gzip, JSON beautify and minify, UNIX timestamps, defang and fang of URLs and IPs, XOR, and a long list of text operations (find and replace, regular expressions, sort, unique, head and tail, case conversions, line numbers, UUID…). Steps can be disabled or given a breakpoint, and **Auto Bake** re-runs the recipe as you type.

Since WebSSH 33.0 the input can be a file, loaded or dropped, up to 10 MB, and the output can be saved as a file. FREE saves 1 recipe.

### HTTP Forge
A curl-compatible HTTP client. Methods GET to OPTIONS, query parameters, headers, raw (JSON, XML, text) or form body, Basic, Bearer or custom-header authentication, redirects, timeout and insecure-TLS switches. **Import curl** parses a command you paste (`-X`, `-H`, `-d`, `-u`, `-L`, `-k`…); **Copy as curl** produces one, with or without the credentials. The response shows status, final URL, headers and a pretty or raw body up to 5 MB.

Saved requests sync with iCloud; their secrets stay in the device Keychain and never leave it. FREE saves 1 request, sending is unlimited. `{{variables}}` in requests are PRO.

### Secret Share
Shares a password, a token or a file through a self-destructing link. The content is encrypted on your device with AES-256-GCM, and the key is placed in the fragment of the link, after `#`, which browsers never send to the server. Two providers: [1time.io](https://1time.io) (expiry from 1 hour to 30 days, 1 to 10 views, files up to 40 MB) and [enclosed.cc](https://enclosed.cc) (delete after reading, files up to 32 MB). An optional passphrase adds a second factor. The result is shown as a link and a QR code.

PRO adds QR styling and self-hosted servers for both providers.

### Code Forge
Generates QR codes, as well as Aztec, PDF417 and Code 128 barcodes, from templates: link, text, Wi-Fi network, contact card, e-mail, SMS, phone, location, event. Export as PNG or vector PDF, or print. Projects are saved and sync with iCloud. FREE keeps 1 project with the standard look; PRO unlocks styling, logos, error-correction levels and **Scan a code** from the camera or an image.

### Crontab Generator
Builds and explains cron schedules. Fill each field with Every, Specific, Range or Step, or paste an expression and read it in plain language, with the next run dates in your time zone. Supports lists, ranges, steps, month and day names, the `@hourly` to `@yearly` shortcuts, and an optional seconds field for Quartz and Spring. FREE shows the next run date, PRO the next 10.

Shortcuts: **Explain Cron Expression**, **Validate Cron Expression** and **Open Cron Generator**.

### Password Generator
Random passwords of 6 to 64 characters from the character sets you pick, with an option to exclude ambiguous characters and a strength meter based on entropy. The clipboard is cleared 30 seconds after a copy. Offline.

Shortcuts: **Generate Password** (length 4 to 128 and character sets); Siri never reads the result aloud.

### Hex Viewer
Opens any file, from a few bytes to several gigabytes, as hex and text, paged so that large files open instantly. Go to an offset, search bytes or text, read the selected bytes as integers in both byte orders, floats or UTF-8. Bytes can be overwritten in place, with a per-byte revert. Viewing and editing are free; saving the result, over the original or as a copy, is PRO. See also [Open files with WebSSH](/documentation/help/howtos/open-files-with-webssh/).

### Text Editor
Edits local files with syntax highlighting, find and replace, and auto-saved drafts. It is the editor used for files opened from the Files app or the Finder. See [Open files with WebSSH](/documentation/help/howtos/open-files-with-webssh/).

### Web Browser
The [embedded browser](/documentation/web-browser/), able to route its traffic through an SSH tunnel to reach the web interfaces of your private network, with private sessions, bookmarks (3 in the FREE version) and saved credentials.

### mashREPL
A [minimal shell](/documentation/mashREPL/) running on the device itself: `ls`, `cat`, `grep`, `curl`, `dig`, `ping`, `whois`, `tar`, a small text editor and `mans`, a port scanner in the spirit of nmap. Its `webssh` command manages the app itself: database backup and restore, import and export, fingerprints.

### Serial Port
On the Mac only, a terminal on a USB-to-serial adapter for switches, routers and boards.

## Tools history
Every run of a network tool is logged in the **History** tile of the sidebar, in the **Tools** segment, with the target as you typed it: tap an entry to open the tool prefilled. The same history feeds the suggestions under the input fields. Entries are deleted after 30 days by default (**Settings ▸ History ▸ Delete history older than**), and the history stays on the device unless you enable **iCloud Sync** in the same settings group. FREE lists the 10 most recent entries and offers 3 suggestions, PRO the whole history and 10 suggestions. Secret Share logs the provider only, never the secret.

## Tools as Shortcuts actions
Since WebSSH 32.7 the Shortcuts app offers **Open Tool** for most tools, plus actions that run in the background and return a result: Get IP Address, DNS Lookup, Domain Whois, Calculate Subnet, Generate Password, and the three cron actions. See [Automate SSH on iPhone with Shortcuts](/documentation/guides/ssh-apple-shortcuts-iphone/).

## Who sees what
WebSSH collects nothing, but a network tool has to talk to someone. For the record:

| Tool | Talks to |
| --- | --- |
| Addresses | Cloudflare or Google DNS, then OpenDNS |
| DNS Lookup | Your system resolvers, with Cloudflare, Google and Quad9 as fallback; Propagation asks up to 29 public resolvers |
| Whois | RDAP and WHOIS servers of the registries |
| Postmaster | Your resolvers, 22 blacklist operators (they see the checked IPs), and the domain's MX hosts on port 25 |
| Certificate Checker, Ping, Traceroute, Network Scanner | The target only |
| Secret Share | 1time.io or enclosed.cc, which receive encrypted content and never the key |
| HTTP Forge, the *HTTP request* step of Baker | The URL you enter |
| Subnet Calculator, Password Generator, Crontab Generator, Code Forge, Hex Viewer, Baker | Nobody, they work offline |

??? question "Missing a tool?"
    The last card of the Tools screen opens the [contact page](/documentation/contact-me/): suggestions are welcome.
