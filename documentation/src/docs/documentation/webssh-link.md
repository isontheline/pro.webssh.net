---
title: WebSSH Link
seo_title: "WebSSH Link: Cloud Services Operated by WebSSH for iPhone, iPad and Mac"
description: "WebSSH Link groups the cloud services run by WebSSH itself: webhook push notifications, a tunnel relay for Public URL and hosted one-time secret sharing. Included in the Developer Tip subscription, no account, no e-mail."
---

# WebSSH Link

!!! info "Coming soon"
    WebSSH Link is being built. This page describes what it is and how it will be offered; the services open with a future version of WebSSH.

**WebSSH Link** is the name of the **cloud services operated by WebSSH itself**. Most of what WebSSH does runs on your device, or goes through third-party providers built into the app (tunnl.gg for Public URL, 1time.io for Secret Share…). Some features need a server that WebSSH runs around the clock: those are WebSSH Link.

## The services
- **Webhook → push notifications**: a URL you paste into a cron job, a Grafana alert or your CI; every device of yours running WebSSH receives the message, and you can read past messages in the app even if you missed the notification.
- **Tunnel relay** for the [Public URL](/documentation/help/networking/public-url/) tool: WebSSH's own relay, available as a provider next to tunnl.gg, under `*.eu.tunnel.webssh.link`. Services are offered per region for the jurisdiction of your data; the **EU** region comes first.
- **Hosted one-time secret sharing**: an instance of the Secret Share backend run by WebSSH under the Link brand, next to the public providers already in the app.

## How to get it
WebSSH Link is included in the **Developer Tip**, the optional monthly or yearly subscription available in the app (Settings → Purchases → Developer Tip). The Developer Tip also includes the **Extras** (mini games and other small pleasures).

It does not require [WebSSH PRO](/documentation/pricing/): you can subscribe without owning PRO. PRO alone does not give access to WebSSH Link, and PRO remains a one-time lifetime purchase that never requires a subscription.

## Positioning
- Every WebSSH Link service keeps a **free third-party counterpart** in the app: nothing is taken away from FREE or PRO users.
- WebSSH Link is the **hosted infrastructure**, which has a recurring cost, and a way to support the development of the app further.

## Privacy
No account, no e-mail, no password: your App Store purchase is the proof, and each device identifies itself with a key generated on the device. WebSSH never holds a private key of yours.

## Related documentation
- [Pricing](/documentation/pricing/)
- [Public URL](/documentation/help/networking/public-url/)
