---
title: "Automate SSH on iPhone with Shortcuts and Deep Links"
description: "Open an SSH or SFTP connection from a Shortcut, a Home Screen icon, an NFC tag or Siri with WebSSH deep links, and run WebSSH tools as Shortcuts actions."
---

# Automate SSH on iPhone with Apple Shortcuts and Deep Links

Apple Shortcuts turns multi-step chores into one tap, a voice command or an automatic trigger. **WebSSH** plugs into it in two ways: **deep links** open an SSH or SFTP connection from any URL-capable action, and since WebSSH 32.7 the built-in **tools** are available as native Shortcuts actions.

This guide shows practical recipes: a Home Screen icon for your server, an NFC tag that opens a connection, a Shortcut that checks DNS before you deploy, and Siri asking for your public IP.

## WebSSH Deep Links in 30 Seconds

A deep link is a URL that opens WebSSH on a given connection:

```
ssh://alice@192.168.1.10:22
sftp://alice@nas.local
```

Options go in the query string. The useful ones for automation:

| Option | Purpose | Example |
| --- | --- | --- |
| `key` | Use the private key with this name | `ssh://alice@host?key=homelab` |
| `name` | Name shown for the connection | `?name=Home%20Server` |
| `save` | Save the connection in your list | `?save=true` |
| `tags` | Tag the connection | `?tags=home,lab` |
| `theme` | Terminal theme | `?theme=GitHub%20Dark` |

If another app already claims `ssh://`, use `webssh://` instead; it takes the same parameters. Full reference: [Deep Linking](/documentation/help/howtos/use-deep-linking/).

!!! warning "Never put a password in a link"
    Shortcuts, NFC tags and Home Screen icons are easy to copy. Reference a key by name with `key=` and let WebSSH hold the secret.

## Recipe 1: A Home Screen Icon for Your Server

1. Open **Shortcuts** and create a new shortcut
2. Add the action **Open URLs** and enter `webssh://alice@192.168.1.10?key=homelab&name=Home%20Server`
3. Name the shortcut, then use the share menu to **Add to Home Screen**

Tapping the icon opens WebSSH straight on the connection. By default WebSSH asks you to confirm a deep link before opening it. For your own shortcuts you can switch **iOS Settings → WebSSH → Deep Linking Strategy** to *Always Allow*.

## Recipe 2: An NFC Tag on the Server Rack

1. In Shortcuts, open **Automation** and create a new personal automation triggered by **NFC**
2. Scan a blank NFC sticker and name it
3. Add **Open URLs** with your `webssh://` link
4. Turn off *Ask Before Running*

Stick the tag on the rack, the NAS or the Raspberry Pi. Holding the phone against it opens the session.

## Recipe 3: Open the Right Connection When You Arrive

Use a **Location** or **Wi-Fi** automation: when the phone joins your home network, open the connection to the local address of the server; when it leaves, open the one that goes through your VPN or jump host. Two shortcuts, two automations.

## Recipe 4: Run Something as Soon as the Session Opens

A deep link opens a connection; it does not run commands. To land directly in a task, create the connection once in WebSSH and set its **Execute command** (Terminal Settings): `tmux new -As ops`, `htop`, or `journalctl -f -u nginx`. Then launch that saved connection from your list, or from a `webssh://` link with the same user and host. See [Create or attach a tmux session](/documentation/help/howtos/tmux/create-attach-existing-tmux-session/).

## WebSSH Tools as Shortcuts Actions

Since WebSSH 32.7, search for **WebSSH** in the Shortcuts action list. You will find, among others:

- **Get IP Address**: your public address, also available by voice with *“Get my IP address with WebSSH”*
- **DNS Lookup** and **Whois**
- **Calculate Subnet**
- **Generate Password**
- **Cron**: validate an expression, explain it, or open the cron generator
- **Open a Tool**: jumps to any WebSSH tool, ping, traceroute, network scanner, certificate checker, Postmaster, mashREPL, and more, also available by voice with *“Open a tool in WebSSH”*

The lookup actions return their result to the next action, so you can chain them. Two examples:

**Pre-deploy DNS check.** *DNS Lookup* for `app.example.com` → *If* the result does not contain the expected IP → *Show Notification* “DNS not propagated yet”. Otherwise → *Open URLs* with the `webssh://` link to the deployment host.

**Is the home connection healthy?** *Get IP Address* → *Show Result*. Combine with the *Open a Tool* action set to *Ping* to reach the diagnostics screen in one step.

## Recipe 5: Spotlight and Siri

- Type `ssh://alice@host` in the iOS **Search** field to open a one-time connection without saving it.
- Say *“Get my IP address with WebSSH”* or *“Open a tool in WebSSH”* to Siri. These two phrases are registered as App Shortcuts; the other actions are available inside the Shortcuts app.

## Related Guides

- [Deep Linking](/documentation/help/howtos/use-deep-linking/)
- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [Wake your PC or server remotely from iPhone](/documentation/guides/wake-pc-remotely-from-iphone/)
- [Access your homelab via SSH tunnel on iOS](/documentation/guides/homelab-ssh-tunnel-ios/)

## Frequently Asked Questions

### Can Apple Shortcuts open an SSH connection in WebSSH?

Yes. Add the Open URLs action with a WebSSH deep link such as webssh://user@host:22?key=mykey. WebSSH opens on that connection. Set Deep Linking Strategy to Always Allow in iOS Settings to skip the confirmation for your own shortcuts.

### Can a Shortcut run a command on my server through WebSSH?

A deep link opens the connection but does not carry a command. Set the connection's Execute command in WebSSH (for example tmux new -As ops) so the session starts in the task you want, then open that connection from the shortcut.

### Which WebSSH actions are available in the Shortcuts app?

Since WebSSH 32.7: Get IP Address, DNS Lookup, Whois, Calculate Subnet, Generate Password, cron validation and explanation, and Open a Tool, which launches any WebSSH tool such as ping, traceroute or the network scanner.

### Is it safe to put my SSH password in a deep link?

No. Links stored in shortcuts, NFC tags or Home Screen icons are easy to copy. Use key authentication and reference the key by name with the key parameter so the secret stays inside WebSSH.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can Apple Shortcuts open an SSH connection in WebSSH?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Add the Open URLs action with a WebSSH deep link such as webssh://user@host:22?key=mykey. WebSSH opens on that connection. Set Deep Linking Strategy to Always Allow in iOS Settings to skip the confirmation for your own shortcuts."
      }
    },
    {
      "@type": "Question",
      "name": "Can a Shortcut run a command on my server through WebSSH?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A deep link opens the connection but does not carry a command. Set the connection's Execute command in WebSSH (for example tmux new -As ops) so the session starts in the task you want, then open that connection from the shortcut."
      }
    },
    {
      "@type": "Question",
      "name": "Which WebSSH actions are available in the Shortcuts app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Since WebSSH 32.7: Get IP Address, DNS Lookup, Whois, Calculate Subnet, Generate Password, cron validation and explanation, and Open a Tool, which launches any WebSSH tool such as ping, traceroute or the network scanner."
      }
    },
    {
      "@type": "Question",
      "name": "Is it safe to put my SSH password in a deep link?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Links stored in shortcuts, NFC tags or Home Screen icons are easy to copy. Use key authentication and reference the key by name with the key parameter so the secret stays inside WebSSH."
      }
    }
  ]
}
</script>
