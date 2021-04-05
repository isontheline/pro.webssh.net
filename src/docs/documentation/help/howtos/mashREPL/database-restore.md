---
title: Database Restore
---

# How to restore a backup of the WebSSH database?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type the following command[^1] : webssh database restore `<webssh.db>`

`<webssh.db>` is the name of your WebSSH database file you want to restore.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15