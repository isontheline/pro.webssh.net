---
title: "How to Check Server Logs from Your iPhone"
description: "Read and follow Linux server logs from your iPhone over SSH: tail -f, journalctl, docker logs, with WebSSH snippets and settings that fit a phone screen."
---

# How to Check Server Logs from Your iPhone

Most on-call questions are answered by thirty lines of log. You do not need a laptop for that: with **WebSSH** you can open the log on your iPhone, follow it live, copy the interesting lines and act on them from the same screen.

This guide covers the commands, how to make log output readable on a phone, and how to turn your usual log checks into one-tap snippets.

## The Commands You Need

**System and service logs (systemd):**

```bash
journalctl -u nginx -n 50 --no-pager          # last 50 lines of a service
journalctl -u nginx -f                        # follow it live
journalctl -p err --since "10 min ago" --no-pager   # errors only, last 10 minutes
journalctl -b -p warning --no-pager           # warnings and worse since boot
```

**Plain log files:**

```bash
tail -n 100 /var/log/syslog
tail -f /var/log/nginx/error.log
grep -i error /var/log/nginx/error.log | tail -n 20
```

**Docker:**

```bash
docker logs --tail 100 myapp
docker logs -f --since 15m myapp
docker compose -f /srv/myapp/compose.yml logs -f --tail 50
```

Press **Ctrl-C** to stop following. On the iPhone keyboard, Ctrl is on the WebSSH accessory row above the keys.

## Make Logs Readable on a Phone Screen

Log lines are long and a phone is narrow. A few habits help a lot:

- **Rotate the iPhone.** Landscape roughly doubles the columns.
- **Lower the font size** for log sessions: see [terminal font size](/documentation/help/SSH/terminal-settings/terminal-font-size/).
- **Drop what you do not need.** `journalctl -o cat` removes timestamps and hostnames; `--no-hostname` keeps the time but drops the host.
- **Cut long lines** when you only need the start: `tail -f app.log | cut -c1-120`.
- **Pretty-print JSON logs** with `jq`: `docker logs --tail 50 api | jq -r '.level + " " + .msg'`.
- **Filter before you read.** `grep -iE 'error|fail|timeout'` beats scrolling.

## Scroll While Following

`tail -f` and `journalctl -f` scroll away as new lines arrive. If you need to read back while still following, use `less`:

```bash
less +F /var/log/nginx/error.log
```

Press **Ctrl-C** to stop and scroll freely, **Shift-F** to resume following, **q** to quit.

## Follow in One Tab, Act in Another

Keep the log running in one terminal and use a second one for commands. On iPhone, tap the *multiple windows* icon at the top left of the terminal and choose **New tab**; switch back and forth with the same icon. See [Multiple connections](/documentation/help/howtos/launching-multiple-terminals/).

When you find the cause, the fix is usually one of these: [restart the service](/documentation/guides/restart-server-from-iphone/) or [edit its config file](/documentation/guides/edit-config-file-remote-server-iphone/).

## Copy Log Lines to Share

- **A few lines:** select the text in the terminal with the standard iOS gesture and tap **Copy**.
- **A whole stretch of output:** open the **⋯** menu, choose **Copy**, then **Show Scrollback Buffer**. The full buffer opens in a separate view where selecting large blocks is easy.

See [copying text from the terminal](/documentation/help/howtos/copying-text-to-clipboard-from-terminal/).

## Turn Your Log Checks into Snippets

A [snippet](/documentation/help/howtos/snippets/) with [dynamic variables](/documentation/help/howtos/snippets/#dynamic-variables) asks which log and how many lines every time you tap it:

```bash
tail -n {{{ LINES : 100 }}} -f {{{ LOG : /var/log/syslog : /var/log/auth.log : /var/log/nginx/error.log }}}
```

A second one for services:

```bash
journalctl -u {{{ UNIT : nginx : postgresql : docker }}} -n {{{ LINES : 50 }}} --no-pager
```

And a one-tap **Ctrl-C** to stop following, using a [key token](/documentation/help/howtos/SSH/adding-control-key-to-snippets/): a snippet whose content is just `<ctrl-c>`.

## Watching Logs for Longer Than a Minute

Two iOS behaviours matter here:

- **The screen locks.** Set **iOS Settings → WebSSH → Device Awake Strategy** to *Keep Device Awake if Session Active* so the phone stays on while a terminal is open.
- **Backgrounding ends the session.** If you switch to another app, iOS suspends WebSSH after about 30 seconds and the SSH connection closes. Run `tail -f` inside [tmux](/documentation/guides/tmux-iphone-persistent-ssh-sessions/) so it keeps running server-side, and reattach when you come back.

For a live number rather than a stream, the [Terminal State Bar](/documentation/terminal-state-bar/) can run a short command on the server at a fixed interval and display the result, for example the count of errors in the last ten minutes.

## Related Guides

- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [Edit a config file on a remote server from iPhone or iPad](/documentation/guides/edit-config-file-remote-server-iphone/)
- [tmux on iPhone: sessions that survive disconnects](/documentation/guides/tmux-iphone-persistent-ssh-sessions/)
- [Why SSH disconnects on iPhone and how to keep sessions alive](/documentation/guides/keep-ssh-session-alive-iphone/)

## Frequently Asked Questions

### How do I stop tail -f on an iPhone?

Press Ctrl-C. In WebSSH the Ctrl key is on the accessory row above the on-screen keyboard. You can also create a snippet containing the key token <ctrl-c> to stop with a single tap.

### Why does the log stop updating when I switch to another app?

iOS suspends apps about 30 seconds after they leave the foreground, which closes the SSH session. Run tail -f or journalctl -f inside tmux so it keeps running on the server, then reattach when you return to WebSSH.

### How can I copy a long block of log output on iPhone?

Open the terminal's ⋯ menu, choose Copy, then Show Scrollback Buffer. The full buffer opens in a separate view where you can select and copy as much as you need.

### How do I read logs on a small screen without wrapping?

Rotate the phone to landscape, reduce the terminal font size, and trim the output: journalctl -o cat drops timestamps, cut -c1-120 shortens lines, and grep filters before you read.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I stop tail -f on an iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Press Ctrl-C. In WebSSH the Ctrl key is on the accessory row above the on-screen keyboard. You can also create a snippet containing the key token <ctrl-c> to stop with a single tap."
      }
    },
    {
      "@type": "Question",
      "name": "Why does the log stop updating when I switch to another app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "iOS suspends apps about 30 seconds after they leave the foreground, which closes the SSH session. Run tail -f or journalctl -f inside tmux so it keeps running on the server, then reattach when you return to WebSSH."
      }
    },
    {
      "@type": "Question",
      "name": "How can I copy a long block of log output on iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open the terminal's ⋯ menu, choose Copy, then Show Scrollback Buffer. The full buffer opens in a separate view where you can select and copy as much as you need."
      }
    },
    {
      "@type": "Question",
      "name": "How do I read logs on a small screen without wrapping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rotate the phone to landscape, reduce the terminal font size, and trim the output: journalctl -o cat drops timestamps, cut -c1-120 shortens lines, and grep filters before you read."
      }
    }
  ]
}
</script>
