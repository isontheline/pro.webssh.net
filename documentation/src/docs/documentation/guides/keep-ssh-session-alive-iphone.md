---
title: "SSH Disconnects on iPhone: How to Keep Sessions Alive"
description: "iOS suspends apps about 30 seconds after you switch away, which ends SSH sessions. What actually helps: tmux, mosh, Split View, keep-awake and server keepalives."
---

# Why SSH Disconnects on iPhone and How to Keep Sessions Alive

You start a command, answer a message, come back, and the terminal says the connection is closed. This is the most common frustration with SSH on a phone, and it is worth understanding before trying to fix it, because the fixes are different depending on why the session dropped.

## What Is Actually Happening

**iOS suspends background apps.** About 30 seconds after you switch to another app or lock the screen, iOS freezes WebSSH to save battery. A frozen app cannot answer the server, so the TCP connection dies. When you come back, the session is gone. This is an operating system rule that applies to every SSH client on iPhone and iPad, not a WebSSH limitation.

**Networks change.** Walking from Wi-Fi to cellular gives your phone a new IP address. A classic SSH connection is bound to the old one and cannot follow.

**Idle connections time out.** Your home router, a corporate firewall or a mobile carrier drops TCP connections that stay silent for a few minutes, even while WebSSH is in the foreground.

Each cause has its own remedy. Here they are, most effective first.

## 1. Make the Disconnection Harmless with tmux

You cannot always prevent the drop, but you can make it cost nothing. Run your shell inside **tmux** on the server: the commands keep running, and reconnecting puts you back exactly where you were.

The whole setup is one command, `tmux new -As main`, placed in the connection's **Execute command** so WebSSH attaches automatically. Full walkthrough: [tmux on iPhone](/documentation/guides/tmux-iphone-persistent-ssh-sessions/).

This is the fix to apply first. Everything below is an improvement on top of it.

## 2. Use mosh for Sessions That Roam and Resume

Since WebSSH 32.9, a connection can run over **mosh** instead of plain SSH (the role is called *SSH Persistent (mosh)* and is marked beta). mosh uses UDP and keeps a session alive across IP changes and periods of silence: switch from Wi-Fi to cellular, lock the phone, come back, and the terminal is still there.

How it works in WebSSH: the app logs in over your normal SSH connection (same key, same password, same 2FA), starts `mosh-server` on the host, then talks to it over UDP. You need:

- the `mosh` package installed on the server (`sudo apt install mosh`, `sudo dnf install mosh`, `brew install mosh`)
- inbound **UDP ports 60000 to 61000** open on the server's firewall
- a UTF-8 locale on the server (WebSSH sets one for the session, but the host must have it installed)

To enable it, edit the connection, open **Roles**, add **SSH Persistent (mosh)** and save. Launch it from the connection's context menu. The [Terminal State Bar](/documentation/terminal-state-bar/) shows the mosh transport state, including when the session is stale or suspended, and the smoothed round-trip time.

Good to know: mosh carries the terminal only. Port forwarding, SFTP and tunnels still use regular SSH. A mosh session that hears nothing from the client for an hour ends on its own, so keep tmux underneath for anything longer.

## 3. Keep WebSSH in the Foreground

If the app never leaves the foreground, iOS never suspends it.

- **On iPad**, put WebSSH in **Split View** or **Slide Over** next to the app you need. The session stays connected while you read documentation or chat.
- **Stop the screen from locking.** In **iOS Settings → WebSSH → Device Awake Strategy**, choose *Keep Device Awake if Session Active*. The phone stays on while a terminal, SFTP or tunnel session is open and goes back to normal when you close it.

## 4. Stop Idle Timeouts on the Server Side

For connections that drop while WebSSH is open but nothing is being typed, have the server send keepalives through the NAT or firewall. In `/etc/ssh/sshd_config`:

```
ClientAliveInterval 60
ClientAliveCountMax 3
```

Then `sudo sshd -t` and `sudo systemctl reload ssh`. The server now pings the client every 60 seconds, which keeps the connection tracked by routers in between.

## 5. Long Jobs Should Not Depend on Your Phone at All

For anything that takes more than a few minutes, detach the job from the session entirely, tmux or not:

```bash
nohup ./backup.sh > backup.log 2>&1 &
systemd-run --unit=backup-now ./backup.sh     # runs as a transient systemd unit
```

Check on it later with `tail backup.log` or `journalctl -u backup-now`.

## Which One Should You Use?

| Situation | Do this |
| --- | --- |
| You switch apps often | tmux, plus the awake setting |
| You move between Wi-Fi and cellular | mosh, with tmux underneath |
| You read docs while working (iPad) | Split View or Slide Over |
| Connection drops after a few idle minutes | ClientAliveInterval on the server |
| The task takes more than ten minutes | Run it detached: nohup, systemd-run or tmux |

## Related Guides

- [tmux on iPhone: sessions that survive disconnects](/documentation/guides/tmux-iphone-persistent-ssh-sessions/)
- [Check server logs from your iPhone](/documentation/guides/check-server-logs-iphone/)
- [Terminal State Bar](/documentation/terminal-state-bar/)
- [Frequently asked questions](/documentation/frequently-asked-questions/)

## Frequently Asked Questions

### Why does my SSH session close when I switch apps on iPhone?

iOS suspends apps about 30 seconds after they leave the foreground. A suspended app cannot keep the TCP connection alive, so the SSH session ends. This applies to every SSH client on iOS. Use tmux on the server so nothing is lost, or mosh so the session itself survives.

### Does WebSSH support mosh?

Yes, since WebSSH 32.9. Add the SSH Persistent (mosh) role to a connection. The server needs the mosh package installed and UDP ports 60000 to 61000 open. WebSSH starts mosh-server through your regular SSH login, so authentication does not change.

### How do I keep my iPhone screen on during an SSH session?

In iOS Settings, open WebSSH and set Device Awake Strategy to Keep Device Awake if Session Active. The screen stays on while a terminal, SFTP or tunnel session is open.

### Can I keep an SSH tunnel or port forward alive in the background on iPhone?

Not once iOS suspends the app. On iPad keep WebSSH visible with Split View or Slide Over. For terminal sessions, mosh survives suspension, but tunnels and port forwarding still need a regular SSH session in the foreground.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does my SSH session close when I switch apps on iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "iOS suspends apps about 30 seconds after they leave the foreground. A suspended app cannot keep the TCP connection alive, so the SSH session ends. This applies to every SSH client on iOS. Use tmux on the server so nothing is lost, or mosh so the session itself survives."
      }
    },
    {
      "@type": "Question",
      "name": "Does WebSSH support mosh?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, since WebSSH 32.9. Add the SSH Persistent (mosh) role to a connection. The server needs the mosh package installed and UDP ports 60000 to 61000 open. WebSSH starts mosh-server through your regular SSH login, so authentication does not change."
      }
    },
    {
      "@type": "Question",
      "name": "How do I keep my iPhone screen on during an SSH session?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In iOS Settings, open WebSSH and set Device Awake Strategy to Keep Device Awake if Session Active. The screen stays on while a terminal, SFTP or tunnel session is open."
      }
    },
    {
      "@type": "Question",
      "name": "Can I keep an SSH tunnel or port forward alive in the background on iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not once iOS suspends the app. On iPad keep WebSSH visible with Split View or Slide Over. For terminal sessions, mosh survives suspension, but tunnels and port forwarding still need a regular SSH session in the foreground."
      }
    }
  ]
}
</script>
