---
title: Enabling Verbose Logging
---

# How to enable verbose logging?
If you need to debug an error (even crash) you will need to enable file verbose logging.

## iOS
1. iOS Settings
2. WebSSH
3. Settings
4. WebSSH > File Logger Level > Verbose
5. Restart WebSSH
6. Reproduce your action
7. Find the log files inside iOS > Files > WebSSH

## macOS
1. Launch WebSSH
2. WebSSH menu (top bar)
3. Settings
4. WebSSH > File Logger Level > Verbose
5. Restart WebSSH
6. Reproduce your action
7. Launch mashREPL (inside WebSSH)
8. Type `pwd`
9. Go to the folder printed
10. Find WebSSH logs there