---
title: Adding Control-Key to Snippets
---

# Adding Control-Key to Snippets
If you want to add a control-key (Ctrl-A / Ctrl-C / Ctrl-D / ...) to a snippet, you can use the following syntax :

`<ctrl-x>` (Replace `x` by the control-key you want to add)

You can put the control-key anywhere in your snippet. So you can use `<ctrl-A>ls` to send Ctrl-A and then `ls` to your SSH session.

# Examples
| Control-Key | Description |
| --- | --- |
| `<ctrl-a>` | Send Ctrl-A |
| `<ctrl-b>[` | Show history of your tmux session |
| `<ctrl-b>"` | Split your tmux session horizontally |
| `<ctrl-b>%` | Split your tmux session vertically |
