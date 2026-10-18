---
title: Public URL
seo_title: "Expose a Local Port to the Internet from iPhone, iPad and Mac - WebSSH Public URL"
description: "Give a port of your device, or of a machine on your local network, a public https address through a tunnel provider such as tunnl.gg. Modes, keys, limits and how the host key is verified."
---

# Public URL[^1]
**Public URL** exposes a port reachable from your device as a public `https://` address: a dev server running on your Mac, a webhook receiver, Home Assistant or a NAS on your home network, a Raspberry Pi… Anyone with the address reaches the service while the tunnel runs, without a VPN, a router change or a server of your own.

Under the hood it is SSH remote port forwarding (`ssh -R`): WebSSH opens an SSH connection to a **tunnel provider**, asks it to publish an address, and relays every incoming request to the host and port you chose. The address only works while the tunnel is running in WebSSH.

!!! info "Providers"
    The first provider is [tunnl.gg](https://tunnl.gg). More providers may be added over time; the provider is chosen when you create a Public URL.

## Create a Public URL
1. Open **Tools** in the sidebar, then **Public URL** (on the Mac, `⌃⌥⌘U`)
2. Press the **[+]** button
3. Pick the **provider**
4. Fill in the **target**: `localhost` for a service running on the device itself, or the address of a machine on your network, such as `192.168.1.20`, and its **port**
5. Choose the **address mode** (see below)
6. Save, then press **Start**

The live screen shows the address with **Copy**, **Share** and **Open** buttons, a QR code, the time left before the provider closes a free tunnel, and a log of the requests that went through: method, path, status, duration and visitor IP. **Stop** closes the tunnel; the address stops answering within seconds.

Public URLs you create appear in the sidebar under **Forwardings** while they run, next to your tunnels and jump hosts.

## Address modes
| Mode | Address | Needs |
| --- | --- | --- |
| **Random** | A new random name on every connection | Nothing |
| **Stable** (default) | The same name every time, derived from the tunnel's SSH key | A key (generated for you) |
| **Pro** | A reserved name of your choice, such as `myapp` | A key verified in your account on the provider |

With tunnl.gg, Random and Stable are free and need no account. **Pro** refers to the provider's own paid plan, taken on the provider's website, not to WebSSH PRO. WebSSH does not sell it and does not unlock it: it only links to the provider's information page.

## Keys
By default WebSSH generates a dedicated **Ed25519 key** for each Public URL, stored in the Keychain of the device and never synced. One key holds one live tunnel at a time, and a Stable address is derived from the key, so each device gets its own address even when the Public URL itself is synced through iCloud. Deleting a Public URL deletes its key: a Stable address cannot be recovered afterwards.

You can instead pick one of your [Identities](/documentation/help/SSH/public-private-key/), limited to Ed25519 and ECDSA keys. An encrypted identity needs its passphrase saved in WebSSH.

For the Pro mode, **Copy public key** in the editor (and in the error shown when the key is refused) gives the line to add in your account on the provider.

## Options
- **Target uses HTTPS**: for a service that only answers in HTTPS (Proxmox, a NAS, UniFi, Home Assistant behind a reverse proxy). The provider only sends plain HTTP into the tunnel; with this switch WebSSH itself opens a TLS connection to the target for each request. Certificates are validated like a browser would; **Accept any certificate**, off by default, skips that validation for a self-signed service on your own network.
- **Host header**: sent to your service instead of the public name, for development servers that reject unknown hosts.
- **Reconnect automatically**: off by default. When enabled, WebSSH reconnects after a drop, with a growing delay, as long as it is in the foreground. iOS suspends the app in the background: a tunnel started on an iPhone or iPad stays up only while WebSSH is on screen.

## How the provider is verified
WebSSH never asks you to trust the host key of a provider:

1. The key presented by the provider must match the key **built into WebSSH**;
2. otherwise it must match an **SSHFP record** of the provider's host that WebSSH validates through **DNSSEC** on the device, so the provider can announce a new key in DNS without waiting for an app update;
3. otherwise the connection is **refused** with *Host key not recognized*. There is no "continue anyway": a user cannot tell a rotated key from an interception.

The live screen says which of the two checks accepted the key. The accepted key is also listed in **Known Hosts**, for information.

??? question "The address answers with an error page although the service runs, and the request log shows a certificate or TLS error"
    The target speaks HTTPS. Enable **Target uses HTTPS** in the settings of the Public URL; if its certificate is self-signed, also enable **Accept any certificate**. The opposite case, a plain HTTP service with the switch on, fails the TLS handshake: turn it off.

??? question "I get *Host key not recognized* on a network that used to work"
    Either the provider rotated its key and your WebSSH is not updated yet, or something on the path is intercepting the connection. Try another network (cellular instead of Wi-Fi, for instance); if it persists, update WebSSH or contact the provider.

## Limits of free tunnels (tunnl.gg)
- A free tunnel closes after **24 hours**, or after **2 hours without traffic**.
- **3 tunnels** at a time per IP address, **10 new connections per minute** per IP address.
- Browsers visiting a free tunnel see a **tunnl.gg notice page once a day**, a phishing protection; tools such as webhooks or `curl` are not affected.
- Request and response bodies up to 128 MB; WebSockets are supported.

The provider's Pro plan lifts these limits and adds reserved names. See the [tunnl.gg documentation](https://tunnl.gg/docs).

## Good to know
- The target can be any host your device can reach: on an iPhone the common case is a machine on the local network, which asks for the **local network** permission the first time.
- **Where encryption ends.** Visitors reach the provider over HTTPS; the provider forwards the traffic to WebSSH over SSH. The relay therefore sees the content of the requests, like any tunnel service. Do not expose a service you would not put behind the provider.
- The request log lives in memory for the duration of the session and is never saved.
- FREE keeps **1 saved Public URL**; [WebSSH PRO](/documentation/pricing/) removes the limit. Every mode of every provider is available in FREE.
- Exposing a port of a *remote* server you are connected to is a different need: see [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/) and the [port forwarding overview](/documentation/help/networking/port-forwarding/).
- Abuse of a tunnl.gg address can be reported to `abuse@tunnl.gg` with the address and timestamps.

## Related documentation
- [Expose a local port to the Internet from iPhone, iPad or Mac](/documentation/guides/expose-local-port-internet-iphone/) — step-by-step guide with webhook and Home Assistant examples
- [Port Forwarding overview](/documentation/help/networking/port-forwarding/)
- [SSH Public / Private Key Pair](/documentation/help/SSH/public-private-key/)
- [Tools](/documentation/tools/)

[^1]: Available since WebSSH 33.2
