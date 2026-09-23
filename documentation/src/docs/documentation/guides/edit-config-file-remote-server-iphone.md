---
title: "Edit a Config File on a Remote Server from iPhone or iPad"
description: "Three ways to edit a remote config file from iPhone or iPad with WebSSH: the SFTP editor, nano or vim over SSH, and sed one-liners. Backup, validate, roll back."
---

# How to Edit a Config File on a Remote Server from iPhone or iPad

Changing one line in `nginx.conf`, adding a host to `/etc/hosts`, fixing a typo in a `.env` file: small edits should not require a laptop. **WebSSH** gives you three ways to do them from an iPhone or iPad, from a graphical editor to a single command.

Pick the one that fits the file and the situation, and keep the backup and validation steps: they are what make editing from a phone safe.

## Step 0: Back Up First

Whatever method you choose, start with a copy you can restore in one command:

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak-$(date +%F)
```

## Option 1: The Built-in SFTP Editor

Best for files your user can write, and for anything longer than a few lines.

1. Open (or create) an **SFTP** connection to the server. SFTP uses the same host, port, user and key as SSH.
2. Navigate to the file and tap it. WebSSH opens it in the text editor.
3. Make your changes.
4. Tap **Save**. The file is written back to the server.

With an external keyboard the editor supports search and replace (**Cmd-F**, **Cmd-Option-F** to replace, **Alt-G** to jump to a line). See [Search and replace in the SFTP editor](/documentation/help/howtos/SFTP/search-replace-text-editor/).

!!! tip "Skip the “Are you sure to edit?” prompt for your usual extensions"
    Add `#!SFTPTextEditorDefaultFileExtensions .conf,.env,.yml,.json` to your [WebSSH SSH Config File](/documentation/help/SSH/ssh-config-file/). Files with those extensions open directly in the editor.

!!! warning "Files owned by root"
    SFTP runs with the permissions of the user you log in as. If the file belongs to root and your user cannot write it, use option 2 or 3 with `sudo`, or copy the file to your home directory, edit it there, then `sudo cp` it back.

Since WebSSH 32.9 you can also open a file browser (SCP) directly from an SSH terminal, so you can switch from shell to editor without launching a second connection.

## Option 2: nano or vim over SSH

Best for root-owned files and for servers where you already have a shell open.

**nano** is the friendlier choice on a phone:

```bash
sudo nano /etc/nginx/nginx.conf
```

Save with **Ctrl-O**, then **Enter**, quit with **Ctrl-X**. Both keys are on the WebSSH accessory row above the keyboard.

**vim** works too, and WebSSH snippets make the awkward key sequences one tap. Using [key tokens](/documentation/help/howtos/SSH/adding-control-key-to-snippets/):

| Snippet name | Content | What it does |
| --- | --- | --- |
| vim: save and quit | `<esc>:wq` | Save and exit |
| vim: quit without saving | `<esc>:q!` | Discard and exit |
| nano: save and quit | `<ctrl-o>` then a new line, then `<ctrl-x>` | Write the file and exit |

Add a new line in the snippet editor wherever you need an Enter key.

## Option 3: A sed One-liner

Best for a known, repeatable change: flipping a value, commenting a line out, adding a line.

```bash
# change a value
sudo sed -i 's/^worker_processes .*/worker_processes 4;/' /etc/nginx/nginx.conf

# comment out a line
sudo sed -i 's/^PasswordAuthentication yes/#&/' /etc/ssh/sshd_config

# append a line if it is missing
grep -q '^192.168.1.20 nas$' /etc/hosts || echo '192.168.1.20 nas' | sudo tee -a /etc/hosts
```

Turn the ones you use often into a [snippet](/documentation/help/howtos/snippets/) with [dynamic variables](/documentation/help/howtos/snippets/#dynamic-variables):

```bash
sudo sed -i 's/^{{{ KEY }}} .*/{{{ KEY }}} {{{ VALUE }}}/' {{{ FILE : /etc/nginx/nginx.conf }}}
```

## Validate Before You Apply

A syntax error in a config file can take the service down when it restarts. Most daemons can check a file without applying it:

```bash
sudo nginx -t
sudo sshd -t
sudo apachectl configtest
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo visudo -c
docker compose -f /srv/myapp/compose.yml config --quiet
```

!!! warning "Be extra careful with sshd_config"
    If you break the SSH server configuration and restart it, you lose your only way in. Always run `sudo sshd -t` first, and keep a second session open until you have confirmed a fresh connection works.

## Apply and Roll Back

Apply the change with a reload when the service supports it, a restart otherwise. See [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/).

If something breaks, the backup from step 0 puts things back:

```bash
sudo cp /etc/nginx/nginx.conf.bak-2026-09-23 /etc/nginx/nginx.conf && sudo systemctl reload nginx
```

## Related Guides

- [Transfer files via SFTP on iPhone and iPad](/documentation/guides/sftp-file-transfer-iphone/)
- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [Check server logs from your iPhone](/documentation/guides/check-server-logs-iphone/)
- [Search and replace in the SFTP editor](/documentation/help/howtos/SFTP/search-replace-text-editor/)

## Frequently Asked Questions

### Can I edit a file owned by root with the SFTP editor?

Only if the user you log in as can write it, because SFTP uses that user's permissions. For root-owned files use sudo nano or sudo vim in an SSH session, a sudo sed one-liner, or edit a copy in your home directory and copy it back with sudo cp.

### How do I press Esc or Ctrl in vim and nano on an iPhone?

WebSSH shows an accessory row above the on-screen keyboard with Esc, Ctrl, Tab and the arrow keys. For sequences you type often, create a snippet with key tokens such as <esc>:wq for vim or <ctrl-o> and <ctrl-x> for nano.

### How do I check a config file before restarting the service?

Most daemons have a test mode: nginx -t, sshd -t, apachectl configtest, haproxy -c, visudo -c. Run it before reloading or restarting, especially for sshd_config, where a mistake can lock you out.

### Does the WebSSH SFTP editor support search and replace?

Yes. With an external keyboard use Cmd-F to search, Cmd-Option-F to replace, Shift-Cmd-Option-F to replace all and Alt-G to jump to a line.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I edit a file owned by root with the SFTP editor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only if the user you log in as can write it, because SFTP uses that user's permissions. For root-owned files use sudo nano or sudo vim in an SSH session, a sudo sed one-liner, or edit a copy in your home directory and copy it back with sudo cp."
      }
    },
    {
      "@type": "Question",
      "name": "How do I press Esc or Ctrl in vim and nano on an iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WebSSH shows an accessory row above the on-screen keyboard with Esc, Ctrl, Tab and the arrow keys. For sequences you type often, create a snippet with key tokens such as <esc>:wq for vim or <ctrl-o> and <ctrl-x> for nano."
      }
    },
    {
      "@type": "Question",
      "name": "How do I check a config file before restarting the service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most daemons have a test mode: nginx -t, sshd -t, apachectl configtest, haproxy -c, visudo -c. Run it before reloading or restarting, especially for sshd_config, where a mistake can lock you out."
      }
    },
    {
      "@type": "Question",
      "name": "Does the WebSSH SFTP editor support search and replace?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. With an external keyboard use Cmd-F to search, Cmd-Option-F to replace, Shift-Cmd-Option-F to replace all and Alt-G to jump to a line."
      }
    }
  ]
}
</script>
