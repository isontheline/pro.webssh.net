---
title: Enabling Verbose Logging
---

# How to enable verbose logging?
If you want to debug an error perhaps you will need verbose logging to be enabled inside WebSSH.

## iOS
1. iOS Settings
2. WebSSH
3. Settings
4. Log Level > Verbose
5. Restart WebSSH
6. Reproduce your action
7. Find the log files inside iOS > Files > WebSSH

## macOS
1. Launch WebSSH
2. WebSSH menu (top bar)
3. Settings
4. Log Level > Verbose
5. Restart WebSSH
6. Reproduce your action
7. Launch mashREPL (inside WebSSH)
8. Type `pwd`
9. Go to the folder printed
10. Find WebSSH logs there