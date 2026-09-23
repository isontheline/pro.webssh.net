---
title: "tmux on iPhone: SSH Sessions That Survive Disconnects"
description: "Use tmux with WebSSH so your SSH work survives iOS backgrounding and network changes. Auto-attach on connect, send Ctrl-B from a snippet, scroll and copy in tmux."
---

# tmux on iPhone: Persistent SSH Sessions That Survive Disconnects

On a phone, the SSH connection is the fragile part. You walk from Wi-Fi to cellular, a notification pulls you into another app, the screen locks, and the session is gone. **tmux** solves this on the server side: your shell keeps running in a tmux session, and every new SSH connection simply reattaches to it.

This guide shows how to set up tmux for phone use with **WebSSH**: attach automatically, drive it without a physical keyboard, and scroll and copy inside it.

## Why tmux Is the Right Tool on iOS

iOS suspends an app roughly 30 seconds after you leave it, and a suspended app cannot keep a TCP connection open. WebSSH cannot change that. What tmux changes is what the disconnection costs you: nothing. The long `apt upgrade`, the `tail -f`, the half-typed command are all still there when you reconnect. See [why SSH disconnects on iPhone](/documentation/guides/keep-ssh-session-alive-iphone/) for the full picture.

## Install tmux on the Server

```bash
sudo apt install tmux        # Debian, Ubuntu, Raspberry Pi OS
sudo dnf install tmux        # Fedora, RHEL
sudo apk add tmux            # Alpine
brew install tmux            # macOS
```

## The One Command to Remember

```bash
tmux new -As main
```

`new -A` attaches to the session named `main` if it exists and creates it otherwise. Run it every time you connect and you always land in the same session, whatever happened to the previous connection.

## Attach Automatically When WebSSH Connects

Do not type the command by hand. Put it in the connection's **Execute command**:

1. Edit the connection in WebSSH
2. Open **Terminal Settings**
3. Tap **Execute command** and choose **Custom**
4. Enter `tmux new -As main`
5. Save

From now on, launching the connection drops you straight into your tmux session. See [Create or attach an existing tmux session](/documentation/help/howtos/tmux/create-attach-existing-tmux-session/).

## Drive tmux Without a Physical Keyboard

Every tmux command starts with the prefix **Ctrl-B**. On the iPhone you can press it from the WebSSH accessory row, but the faster way is a set of [snippets](/documentation/help/howtos/snippets/) using [key tokens](/documentation/help/howtos/SSH/adding-control-key-to-snippets/). One tap sends the whole sequence:

| Snippet name | Content | Effect |
| --- | --- | --- |
| tmux: detach | `<ctrl-b>d` | Leave the session running and return to the shell |
| tmux: new window | `<ctrl-b>c` | Open a new window inside the session |
| tmux: next window | `<ctrl-b>n` | Cycle through windows |
| tmux: split | `<ctrl-b>"` | Split the current pane top and bottom |
| tmux: copy mode | `<ctrl-b>[` | Enter copy mode to scroll back |
| tmux: list sessions | `tmux ls` plus a new line | Show all sessions on the server |

Give these snippets the tag `*` or the tags of your tmux-enabled connections so they show up where you need them.

!!! tip "Windows beat panes on a phone"
    On an iPhone screen, several tmux **windows** (one full-screen shell each, switched with `<ctrl-b>n`) are far more usable than split panes. Save panes for the iPad.

## Scroll Back and Copy Inside tmux

Inside tmux, the scrollback belongs to tmux, not to the WebSSH terminal. To read older output:

1. Enter copy mode: `<ctrl-b>[` (or the snippet above)
2. Scroll with the arrow keys or **Page Up**/**Page Down** from the accessory row
3. Press **q** to leave copy mode

To copy text, use the standard iOS selection gesture on the visible screen. For a long block, enter copy mode, page to the start, and select from there. See [scrollback buffer in tmux](/documentation/help/howtos/tmux/tmux-scrollback-buffer/).

## A Small tmux.conf for Phone Use

Put this in `~/.tmux.conf` on the server:

```
set -g history-limit 20000     # more scrollback
set -g mouse on                # touch-scroll and tap to select pane
set -g status-interval 5
set -g status-right '#H %H:%M' # host and time in the status bar
setw -g automatic-rename on
```

Reload with `tmux source-file ~/.tmux.conf`.

## Housekeeping

```bash
tmux ls                        # what is running
tmux kill-session -t main      # end a session you no longer need
tmux rename-session -t main ops
```

## Related Guides

- [Why SSH disconnects on iPhone and how to keep sessions alive](/documentation/guides/keep-ssh-session-alive-iphone/)
- [Check server logs from your iPhone](/documentation/guides/check-server-logs-iphone/)
- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [Adding Control keys to snippets](/documentation/help/howtos/SSH/adding-control-key-to-snippets/)

## Frequently Asked Questions

### How do I press Ctrl-B in tmux on an iPhone?

Use the Ctrl key on the WebSSH accessory row above the keyboard, then press b. Faster: create a snippet whose content is <ctrl-b> followed by the tmux key, for example <ctrl-b>d to detach, and run it with one tap.

### Can WebSSH attach to my tmux session automatically?

Yes. Edit the connection, open Terminal Settings, set Execute command to Custom and enter `tmux new -As main`. Every launch of that connection then creates or reattaches the session.

### Why can't I scroll back in the WebSSH terminal when tmux is running?

tmux manages its own scrollback. Enter copy mode with Ctrl-B then [ to scroll through the history, and press q to leave it. Setting mouse on in ~/.tmux.conf also lets you touch-scroll.

### Does tmux keep my command running if iOS closes the SSH connection?

Yes. The command runs inside the tmux session on the server, so the loss of the SSH connection does not affect it. Reconnect and run tmux new -As main to pick up exactly where you left off.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I press Ctrl-B in tmux on an iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the Ctrl key on the WebSSH accessory row above the keyboard, then press b. Faster: create a snippet whose content is <ctrl-b> followed by the tmux key, for example <ctrl-b>d to detach, and run it with one tap."
      }
    },
    {
      "@type": "Question",
      "name": "Can WebSSH attach to my tmux session automatically?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Edit the connection, open Terminal Settings, set Execute command to Custom and enter tmux new -As main. Every launch of that connection then creates or reattaches the session."
      }
    },
    {
      "@type": "Question",
      "name": "Why can't I scroll back in the WebSSH terminal when tmux is running?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "tmux manages its own scrollback. Enter copy mode with Ctrl-B then [ to scroll through the history, and press q to leave it. Setting mouse on in ~/.tmux.conf also lets you touch-scroll."
      }
    },
    {
      "@type": "Question",
      "name": "Does tmux keep my command running if iOS closes the SSH connection?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The command runs inside the tmux session on the server, so the loss of the SSH connection does not affect it. Reconnect and run tmux new -As main to pick up exactly where you left off."
      }
    }
  ]
}
</script>
