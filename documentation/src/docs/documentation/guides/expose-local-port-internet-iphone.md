---
title: Expose a Local Port to the Internet from iPhone, iPad or Mac
description: "Get a public https URL for a dev server, a webhook receiver, Home Assistant or a Raspberry Pi from your iPhone, iPad or Mac with WebSSH Public URL. No router change, no VPN, no account."
---

# Expose a Local Port to the Internet from iPhone, iPad or Mac

You are testing a webhook and the third-party service needs a public URL to call. You want to show a colleague the web app running on your Mac. Home Assistant lives on a Raspberry Pi at home and you would like to reach it for an hour from outside, without opening your router. In every case the need is the same: give a port that only your device can reach a public `https://` address, for as long as you need it.

WebSSH does this with **Public URL**, built on SSH remote port forwarding and a tunnel provider. This guide walks through the setup and the common cases.

## What you need

- [WebSSH](https://apps.apple.com/app/id497714887) on your iPhone, iPad or Mac
- The service you want to expose, running on the device itself or on a machine of the same local network
- Nothing else: no account, no server, no router configuration

!!! tip "How it works"
    WebSSH opens an SSH connection to a tunnel provider ([tunnl.gg](https://tunnl.gg/pricing?ref=webssh) today) and asks it to publish an address. Each request arriving on that address travels back through the SSH connection and WebSSH delivers it to the host and port you chose. The address works only while the tunnel runs in WebSSH.

## Step by step

1. Open **Tools** in the sidebar and choose **Public URL** (`⌃⌥⌘U` on the Mac)
2. Press **[+]** and pick the provider
3. **Target**: `localhost` for a service on the device, or the LAN address of the machine, and the port
4. **Address**: keep **Stable** to get the same address every time, or **Random** for a throwaway one
5. Save, then press **Start**

After a second or two the live screen shows the address. **Copy** it, **Share** it, scan the QR code with another phone, or **Open** it in a browser. Every request that goes through is logged with its method, path, status and duration, which is exactly what you want when debugging a webhook.

## Case 1: a webhook receiver on your Mac

Your handler listens on `localhost:3000`. Create a Public URL with target `localhost` and port `3000`, start it, and paste `https://<name>.tunnl.gg/webhooks/stripe` in the dashboard of the service. Each call appears in the request log with its status code and the time your handler took to answer. A `detail` line tells you when nothing answered on the port. With WebSSH PRO, tap a call to read the headers and the JSON Stripe sent, **Replay** it against your handler after a fix instead of re-triggering the event in the dashboard, or **Copy as cURL** to share it. To keep strangers away from the endpoint, set the Public URL to **Secret link** and register the link with its key in Stripe.

??? tip "Development servers that check the Host header"
    Some frameworks refuse requests whose `Host` header is not `localhost`. Set **Host header** to `localhost` in the options of the Public URL and the provider rewrites it for you.

## Case 2: Home Assistant on a Raspberry Pi, from your iPhone

Home Assistant answers on `192.168.1.20:8123` at home. On your iPhone, create a Public URL with target `192.168.1.20` and port `8123`. iOS asks for the **local network** permission the first time; accept it so WebSSH can reach the Pi. Start the tunnel and open the address from anywhere.

Two things to keep in mind on an iPhone or iPad: the tunnel lives only while WebSSH is on screen (iOS suspends apps in the background), and the Pi must stay reachable from the phone, so the phone has to be on the home Wi-Fi.

## Case 3: show a colleague the app running on your Mac

Target `localhost`, the port of your app, mode **Random** if you prefer a disposable address. Share the link; stop the tunnel when the demo is over and the address dies within seconds. Browsers see a one-time notice page from the provider on free tunnels, once a day: tell your colleague to expect it.

## Finding the target without typing an address

On the iPhone especially, **Discover on network** in the target section lists what the network announces with Bonjour: Home Assistant, a Synology, printers. Tap the service, the host and port are filled in, and HTTPS is switched on when the service announces it. Proxmox and most custom servers stay silent: type their address.

## Case 4: a service that only speaks HTTPS

Proxmox on `192.168.1.5:8006`, a Synology on `5001`, UniFi on `8443`: these answer in HTTPS only, often with a self-signed certificate. The provider sends plain HTTP into the tunnel, so a plain forward would fail at the TLS handshake. In the Public URL, turn on **Target uses HTTPS**: WebSSH opens a TLS connection to the service itself for each request. If the certificate is self-signed, also turn on **Accept any certificate**, which only concerns the hop between WebSSH and the service on your own network.

## Stable, Random or Pro?

| Mode | When |
| --- | --- |
| **Stable** | The address must survive restarts: a webhook you register once, a bookmark. Derived from a key WebSSH generates for this Public URL, free, no account. |
| **Random** | A demo, a quick test. New name every time. |
| **Pro** | You want a name of your choice, such as `myapp.tunnl.gg`, and no time limit. This is the provider's own paid plan, taken on its website; WebSSH only links to its information page. |

A Stable address belongs to the device that created it: the key behind it never leaves that device's Keychain. Delete the Public URL and the address is gone for good.

## Security notes

- The address is public while the tunnel is open. Anyone who has it reaches your service: put a password on the service, protect the Public URL with a **password** or a **secret link** (WebSSH PRO, enforced on your device), or stop the tunnel when you are done.
- Visitors reach the provider over HTTPS and the provider forwards the traffic to WebSSH over SSH, so the provider sees the requests in clear. Do not expose what you would not hand to the provider.
- WebSSH verifies the provider's host key against a key built into the app, or an SSHFP record validated through DNSSEC. A key matching neither is refused, no questions asked.
- Free tunnels close after 24 hours or 2 hours without traffic; a request log that stops growing usually means the service behind the tunnel stopped, not the tunnel.

## Troubleshooting

??? question "The address answers with an error page saying nothing listens"
    WebSSH could not connect to the target. Check the port, and on an iPhone check that the local network permission was granted and that the phone is on the same network as the target.

??? question "The request log shows a TLS or certificate error for every request"
    The service speaks HTTPS: enable **Target uses HTTPS**, and **Accept any certificate** if its certificate is self-signed. If the service speaks plain HTTP, turn **Target uses HTTPS** off.

??? question "*Key refused* when starting a Pro tunnel"
    The key of this Public URL is not verified in your account on the provider. Use **Copy public key** in the error card, add the key in your account, complete the verification and start again.

??? question "*Host key not recognized*"
    The provider presented a key that matches neither the key built into WebSSH nor a DNSSEC-validated SSHFP record. Try another network; if it persists, update WebSSH or contact the provider.

??? question "The tunnel stops as soon as I switch to another app on my iPhone"
    Expected: iOS suspends WebSSH in the background. Keep WebSSH on screen, use a Mac for long-running tunnels, or enable **Reconnect automatically** so the tunnel comes back when you return.

## Related documentation

- [Public URL](/documentation/help/networking/public-url/) — reference: modes, keys, limits, host key verification
- [Port Forwarding overview](/documentation/help/networking/port-forwarding/) — the `-L` and `-D` tunnels towards your own servers
- [Access your homelab remotely via SSH tunnel](/documentation/guides/homelab-ssh-tunnel-ios/)
- [Tools](/documentation/tools/)
