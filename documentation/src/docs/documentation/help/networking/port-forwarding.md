---
title: Port Forwarding
---

# Port Forwarding
WebSSH's Tunnel feature will let you to enable [**Local Port Forwarding (LPF)**](/documentation/help/networking/local-port-forwarding/) and [**Dynamic Port Forwarding (DPF)**](/documentation/help/networking/dynamic-port-forwarding/).

Local Port Forwarding and Dynamic Port Forwarding are both techniques used in SSH tunneling, but they have different use cases. 

Here's a little table summarizing the key differences :

| Feature | Local Port Forwarding | Dynamic Port Forwarding |
| --- | --- | --- |
| Purpose | Forward traffic from a local port to a remote host/service | Create a SOCKS proxy for accessing multiple remote services |
| Security                | Provides secure access to a specific remote service | Can potentially provide access to multiple remote services |
| Example Usage           | Accessing a web server on a remote host      | Accessing multiple remote services through a proxy         |

In summary, SSH Local Port Forwarding is used to forward traffic from a specific local port to a specific remote host/service, while Dynamic Port Forwarding is used to create a SOCKS proxy that can be used to access multiple remote services. 

Both are simple to use, and can be configured in WebSSH by following the instructions below :

[:fontawesome-solid-arrows-split-up-and-left: Local Port Forwarding](/documentation/help/networking/local-port-forwarding/){ .md-button .md-button--primary }
[:fontawesome-brands-galactic-republic: Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/){ .md-button .md-button--primary }