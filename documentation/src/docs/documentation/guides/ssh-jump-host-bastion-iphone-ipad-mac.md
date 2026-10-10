---
title: "SSH Through a Bastion (Jump Host) from iPhone, iPad and Mac"
description: "Reach servers hidden behind a bastion from iPhone, iPad or Mac with WebSSH jump hosts: the ProxyJump equivalent, multi-hop chains, per-hop keys and 2FA, SFTP and SCP through the bastion, and what to do for tunnels."
---

# SSH Through a Bastion (Jump Host) from iPhone, iPad and Mac

Many networks expose a single SSH server to the outside, the **bastion** or **jump host**, and keep every other machine on a private network behind it. On a desktop you would write `ssh -J bastion internal` or set `ProxyJump` in your SSH config. Since WebSSH 32.4 the same thing is a field in the connection form: pick a saved connection as the **Jump Host** of another one, and WebSSH logs into the bastion first, then opens the real connection through it.

The bastion only carries encrypted traffic. The SSH session to the internal server is negotiated end to end, with the internal server's own host key and your own credentials for it.

??? info "WebSSH PRO"
    Jump hosts are part of [WebSSH PRO](/documentation/pricing/). On the free version, tapping the **Jump Host** row opens the upgrade screen, and a connection that carries a jump host (synced from another device, for instance) refuses to launch with *Using a jump host requires WebSSH PRO*.

## What You Need

- A **saved connection to the bastion** in WebSSH that works on its own: host, user, key or password, 2FA if any. Test it once directly.
- The **internal server's address as the bastion sees it**: its private IP or a hostname the bastion can resolve. WebSSH does not resolve this name on your device; the bastion does.
- The credentials for the internal server. The bastion and the internal server can use different users, keys and passwords.

## Set Up the Jump Host

1. Create or edit the connection to the **internal server**. Put its private address in **Host**, for example `10.0.1.20`.
2. In the SSH section of the form, tap the **Jump Host** row (it reads *No* by default).
3. Pick the bastion in the list. The list only shows saved SSH connections; the search field matches names, hosts and tags.
4. Save, then launch the connection as usual.

The loading sheet shows the progress hop by hop, *Hop 1/2: bastion.example.com*, then *Hop 2/2: 10.0.1.20*. Every hop asks what it would ask on its own: passphrase, password, two-factor code, host key confirmation. A prompt coming from a hop is prefixed with the hop's name so you always know which server is asking.

To remove a jump host, tap the ⊗ button at the right of the row.

??? tip "Try it before saving: the Through menu"
    You can also jump through an SSH terminal that is already open, without touching the connection. Long press the server card, open the **Through** submenu and choose one of your open SSH sessions. The server launches through that session once. This is handy to check that the internal address is right before you set a permanent jump host.

## Multi-Hop Chains

A jump host can itself have a jump host. WebSSH follows the references, outermost first, and opens up to **5 jump hosts** before the target. A classic three-level layout looks like this:

| Connection | Host | Jump Host |
| --- | --- | --- |
| Office bastion | `bastion.example.com` | No |
| Lab gateway | `192.168.50.1` | Office bastion |
| Lab server | `192.168.50.42` | Lab gateway |

Launching *Lab server* opens three SSH sessions in a row. WebSSH refuses to save a selection that would loop back on itself, and a loop that appears later, after a sync for instance, stops the launch with *The jump host configuration contains a loop*.

## What Goes Through the Jump Host

Once a connection has a jump host, these launches use it:

- the **SSH** terminal
- **SFTP** and **SCP** file browsers
- the **Proxmox-over-SSH** role
- **Run on Hosts**, the [command on multiple hosts](/documentation/help/howtos/run-snippet-on-multiple-hosts/) feature

These do **not**, and connect directly:

- **Tunnels**, local and dynamic port forwarding, and the embedded web browser that relies on them
- **mosh** sessions
- **Telnet**

To reach a web interface behind the bastion, for example a Proxmox or Grafana page, keep using a tunnel to the bastion: start a [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/) tunnel to it, then open the internal URL in the WebSSH web browser. The [homelab tunnel guide](/documentation/guides/homelab-ssh-tunnel-ios/) walks through it.

## How Hops Behave

- **Shared and reused.** The hop sessions are headless SSH sessions with no shell. They are shared by every session that needs them and closed on their own when the last one ends. If you already have a terminal open on the bastion, WebSSH jumps through it instead of logging in again.
- **Visible in the sidebar.** Hidden hops are listed in the **Forwardings** section as `user@bastion` with the subtitle *Jump Host · N*, where N is the number of sessions depending on it. **Disconnect** closes the hop and everything behind it. A session that went through a jump host shows `→ user@host` under its name, and its **Connection Info** sheet lists the chain.
- **Reconnect rebuilds the chain.** A reconnection reopens the hops that died and reuses the ones still alive.
- **First hop only.** [Port knocking](/documentation/help/networking/port-knocking/) and the DNS resolution strategy apply to the first hop, the only one your device reaches directly. Later hops are resolved by the server before them.
- **Per-hop SSH config.** Each hop uses its own saved settings and its own `Host` block of your [SSH config file](/documentation/help/SSH/ssh-config-file/). `ProxyJump` and `ProxyCommand` directives are not read; the Jump Host row replaces them.
- **Host keys.** Every hop and the target are checked separately, and each fingerprint is stored under the hostname and port as you typed them. The first launch asks you to trust the internal server's key, like any new server.
- **Alternative addresses.** An [alternative address](/documentation/help/networking/alternative-addresses/) picked from the context menu applies to the target, and is resolved by the bastion.
- **iCloud.** The jump host reference syncs with the connection. The bastion connection must exist on the other device too, otherwise the launch says *The configured jump host could not be found*.

## Not Available Through a Jump Host

- The [Terminal State Bar](/documentation/terminal-state-bar/) is not shown on sessions going through a jump host.
- **Ping** and **Traceroute** are removed from the terminal Tools menu, as they would test the bastion, not the target.

## Troubleshooting

??? question "Unable to reach bastion.example.com: …"
    A hop failed. The second part of the message is the real error: wrong credentials, no route, timeout. Launch the bastion connection on its own to debug it, then come back.

??? question "The bastion connects, then the internal server times out"
    The address in **Host** must be reachable *from the bastion*. Open a terminal on the bastion and run `nc -zv 10.0.1.20 22` or `ssh 10.0.1.20`. A hostname that only resolves on your LAN, or a public address blocked from the inside, fails here. Also check that `AllowTcpForwarding` is not set to `no` in the bastion's `sshd_config`: jump hosts rely on it.

??? question "The jump host chain exceeds the maximum of 5 hops"
    WebSSH opens at most 5 jump hosts before the target. Shorten the chain, usually by jumping straight from the outer bastion to the machine you need.

??? question "The configured jump host could not be found"
    The bastion connection was deleted, or has not synced yet on this device. Edit the connection: the row reads *No*. Pick the bastion again.

??? question "I get asked for my 2FA code twice"
    Once per hop that requires it. Each prompt is prefixed with the server asking for it. A YubiKey OTP over NFC works on hops too, on iPhone.

??? question "My SFTP session shows the bastion's files"
    The SFTP role honors the jump host, so this means the connection you launched is the bastion itself. Make sure you launched the internal server's connection, the one with the Jump Host row set.

## Related Guides

- [Access your homelab remotely via SSH tunnel on iOS](/documentation/guides/homelab-ssh-tunnel-ios/)
- [SSH port forwarding on iOS](/documentation/guides/port-forwarding-ios/)
- [Run a command on multiple hosts](/documentation/help/howtos/run-snippet-on-multiple-hosts/)
- [Alternative addresses](/documentation/help/networking/alternative-addresses/)
- [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/)

## Frequently Asked Questions

### Does WebSSH support ProxyJump or a jump host on iPhone?

Yes, since WebSSH 32.4. Edit a connection, tap the Jump Host row and pick the saved connection of your bastion. WebSSH logs into the bastion first, then opens the SSH, SFTP or SCP session through it. Chains of up to 5 jump hosts are supported. It is a WebSSH PRO feature.

### Is the bastion able to read my traffic?

No. The SSH session to the internal server is negotiated end to end through the bastion, with the internal server's own host key and your own credentials. The bastion forwards encrypted bytes only, like the ProxyJump option of OpenSSH.

### Can I use a different key or user on the bastion and on the internal server?

Yes. Each hop is a regular saved connection with its own user, key, password and 2FA. WebSSH prompts for each one in turn, prefixing the prompt with the name of the server asking.

### Can a port forward or tunnel go through a jump host?

Not yet. Tunnels, the embedded web browser, mosh and Telnet connect directly. To reach a web interface behind the bastion, start a Dynamic Port Forwarding tunnel to the bastion and open the internal URL in the WebSSH web browser.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does WebSSH support ProxyJump or a jump host on iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, since WebSSH 32.4. Edit a connection, tap the Jump Host row and pick the saved connection of your bastion. WebSSH logs into the bastion first, then opens the SSH, SFTP or SCP session through it. Chains of up to 5 jump hosts are supported. It is a WebSSH PRO feature."
      }
    },
    {
      "@type": "Question",
      "name": "Is the bastion able to read my traffic?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The SSH session to the internal server is negotiated end to end through the bastion, with the internal server's own host key and your own credentials. The bastion forwards encrypted bytes only, like the ProxyJump option of OpenSSH."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use a different key or user on the bastion and on the internal server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Each hop is a regular saved connection with its own user, key, password and 2FA. WebSSH prompts for each one in turn, prefixing the prompt with the name of the server asking."
      }
    },
    {
      "@type": "Question",
      "name": "Can a port forward or tunnel go through a jump host?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not yet. Tunnels, the embedded web browser, mosh and Telnet connect directly. To reach a web interface behind the bastion, start a Dynamic Port Forwarding tunnel to the bastion and open the internal URL in the WebSSH web browser."
      }
    }
  ]
}
</script>
