---
title: Adding Control-Key to Snippets
---

# Adding Control-Key to Snippets
If you want to add a control-key (Ctrl-A / Ctrl-C / Ctrl-D / ...) to a snippet, you can use the following syntax :

`<ctrl-x>` (Replace `x` by the control-key you want to add)

You can put the control-key anywhere in your snippet. So you can use `<ctrl-A>ls` to send Ctrl-A and then `ls` to your SSH session.

Other key tokens are available:

| Token | Description |
| --- | --- |
| `<ctrl-x>` | Control character (`x` is a letter or one of `[ \ ] ^ _ @ /`), case-insensitive |
| `<alt-x>` | Escape followed by `x`, one character, case preserved (`<alt-b>` and `<alt-B>` differ) |
| `<esc>` | Escape (same as `<ctrl-[>`) |
| `<tab>` | Tab (same as `<ctrl-i>`) |

Key tokens are expanded before [dynamic variables](../snippets.md#dynamic-variables), so a value typed in the variables form is never read as a key token.

# Examples
| Control-Key | Description |
| --- | --- |
| `<ctrl-a>` | Send Ctrl-A |
| `<ctrl-b>[` | Show history of your tmux session |
| `<ctrl-b>"` | Split your tmux session horizontally |
| `<ctrl-b>%` | Split your tmux session vertically |
| `<alt-b>` | Move one word backward (readline) |
| `<esc>:wq` | Save and quit vim |
