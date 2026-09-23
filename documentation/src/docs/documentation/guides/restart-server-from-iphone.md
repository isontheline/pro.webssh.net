---
title: "How to Restart a Server or Service from Your iPhone"
description: "Reboot a Linux server, restart a systemd service or a Docker container from your iPhone over SSH with WebSSH. One-tap snippets, sudo password paste, safety checklist."
---

# How to Restart a Server or Service from Your iPhone

The alert arrives while you are away from your desk: a service hangs, a container is stuck, or the whole machine needs a reboot. With **WebSSH** on your iPhone you can fix it in under a minute, no laptop required.

This guide gives you the exact commands, a 30-second safety checklist, and a way to turn each restart into a single tap.

## Before You Restart Anything

Restarting is fast, but restarting the wrong thing costs more time than it saves. Run this first:

```bash
uptime                 # load average and time since last boot
systemctl --failed     # which units are actually broken
df -h /                # a full disk is a common reason a restart won't help
free -m                # memory pressure
who                    # is anyone else logged in?
```

Then restart the **smallest thing that fixes the problem**: a service before a container, a container before the whole host.

## Restart a Service (systemd)

```bash
sudo systemctl restart nginx
systemctl status nginx --no-pager
journalctl -u nginx -n 30 --no-pager
```

Replace `nginx` with `ssh`, `postgresql`, `docker`, `php8.3-fpm` or whatever unit is misbehaving. The `--no-pager` flag matters on a phone: it prints straight to the terminal instead of opening `less`.

!!! tip "Prefer reload when you only changed a config file"
    `sudo systemctl reload nginx` applies a new configuration without dropping active connections. Most web servers, proxies and mail servers support it.

## Restart a Docker Container

```bash
docker ps --format '{{.Names}}\t{{.Status}}'
docker restart myapp
docker logs --tail 50 myapp
```

With Docker Compose:

```bash
docker compose -f /srv/myapp/compose.yml restart myapp
```

## Reboot the Whole Server

```bash
sudo reboot
```

Your SSH session ends immediately. That is expected. Wait 30 to 60 seconds, relaunch the connection in WebSSH and check that `uptime` now shows minutes, not days.

On a machine other people use, give them a warning and keep an exit:

```bash
sudo shutdown -r +2 "Rebooting in 2 minutes for maintenance"
sudo shutdown -c        # cancel while the countdown runs
```

!!! warning "Machines you cannot walk over to"
    Before rebooting a remote VPS, a cloud VM or a server in another building, check that SSH starts at boot (`systemctl is-enabled ssh`) and know how you would reach a console if it does not come back: your cloud provider's console, or your hypervisor. See [SSH into Proxmox from iPhone](/documentation/guides/ssh-proxmox-iphone/).

## Typing the sudo Password on a Phone

Since WebSSH 32.7, when the terminal detects a password prompt such as `[sudo] password for alice:`, it shows a small hint: press **Enter** to paste the password saved with the connection, or simply type the password yourself. Nothing is sent without your action, and the hint can be turned off in **iOS Settings → WebSSH**.

If you use key authentication and have no password stored, you can allow a single command without a password in `sudoers` (edit with `sudo visudo`):

```
alice ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx
```

Keep the list of commands short. A blanket `NOPASSWD: ALL` on a phone-accessible account is a bad idea.

## Make It One Tap with Snippets

A WebSSH [snippet](/documentation/help/howtos/snippets/) inserts a command into the terminal. With [dynamic variables](/documentation/help/howtos/snippets/#dynamic-variables) one snippet covers every service:

```bash
sudo systemctl restart {{{ SERVICE : nginx : postgresql : docker : ssh }}}
systemctl status {{{ SERVICE }}} --no-pager
```

When you tap the snippet, WebSSH shows a small form with a choice list. The same name is asked once, so `SERVICE` is reused on the second line.

For containers:

```bash
docker restart {{{ CONTAINER }}} && docker logs --tail {{{ LINES : 50 }}} {{{ CONTAINER }}}
```

Use [tags](/documentation/help/howtos/link-connections-using-tags/) so the Docker snippets only appear on connections that actually run Docker.

!!! tip "Insert or execute?"
    A snippet is inserted ready to run, so you can read it before pressing Enter. End the snippet with a new line if you want it executed immediately.

## Restarting Several Servers

- **On iPhone**, open one tab per server: tap the *multiple windows* icon at the top left of the terminal, then **New tab**. See [Multiple connections](/documentation/help/howtos/launching-multiple-terminals/).
- **On iPad and Mac**, open the servers in split panes and turn on **Broadcast Input** (WebSSH 32.9, Pro): what you type goes to every pane, so `sudo systemctl restart nginx` runs everywhere at once.
- The same tagged snippet is available on every connection that carries the tag, which keeps the command identical across hosts.

## When the Server Does Not Come Back

1. **Ping** it from WebSSH's built-in tools. If it answers, SSH may simply still be starting.
2. If it is a physical machine that powered off instead of rebooting, send it a magic packet: [Wake your PC or server from iPhone](/documentation/guides/wake-pc-remotely-from-iphone/).
3. If it is a VM, open the hypervisor: [Proxmox from iPhone](/documentation/guides/ssh-proxmox-iphone/), or reach the web console through an [SSH tunnel](/documentation/guides/port-forwarding-ios/).
4. For a cloud VM, use the provider's console or app to check the boot log.

## Related Guides

- [Check server logs from your iPhone](/documentation/guides/check-server-logs-iphone/)
- [Edit a config file on a remote server from iPhone or iPad](/documentation/guides/edit-config-file-remote-server-iphone/)
- [tmux on iPhone: sessions that survive disconnects](/documentation/guides/tmux-iphone-persistent-ssh-sessions/)
- [Snippets](/documentation/help/howtos/snippets/) and [key tokens such as Ctrl-C](/documentation/help/howtos/SSH/adding-control-key-to-snippets/)

## Frequently Asked Questions

### Can I restart a server from my iPhone without typing a password?

Yes. Use key authentication for SSH, then either let WebSSH paste the password saved with the connection when sudo asks for it (WebSSH 32.7 or later), or allow that one command without a password in sudoers with a NOPASSWD rule limited to the restart command.

### Will my SSH session survive a reboot?

No. The session closes as soon as the server goes down. Wait 30 to 60 seconds, then relaunch the connection in WebSSH and check uptime.

### What happens if I switch apps while a restart is running?

The command already sent keeps running on the server. iOS suspends WebSSH about 30 seconds after you leave it, which closes the SSH session, so for long operations run them inside tmux and reattach when you come back.

### Does a WebSSH snippet run the command automatically?

A snippet is inserted into the terminal ready to run, so you can check it first. End the snippet with a new line if you want it to execute as soon as it is inserted.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I restart a server from my iPhone without typing a password?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Use key authentication for SSH, then either let WebSSH paste the password saved with the connection when sudo asks for it (WebSSH 32.7 or later), or allow that one command without a password in sudoers with a NOPASSWD rule limited to the restart command."
      }
    },
    {
      "@type": "Question",
      "name": "Will my SSH session survive a reboot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. The session closes as soon as the server goes down. Wait 30 to 60 seconds, then relaunch the connection in WebSSH and check uptime."
      }
    },
    {
      "@type": "Question",
      "name": "What happens if I switch apps while a restart is running?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The command already sent keeps running on the server. iOS suspends WebSSH about 30 seconds after you leave it, which closes the SSH session, so for long operations run them inside tmux and reattach when you come back."
      }
    },
    {
      "@type": "Question",
      "name": "Does a WebSSH snippet run the command automatically?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A snippet is inserted into the terminal ready to run, so you can check it first. End the snippet with a new line if you want it to execute as soon as it is inserted."
      }
    }
  ]
}
</script>
