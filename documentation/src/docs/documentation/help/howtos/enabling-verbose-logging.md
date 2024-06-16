---
title: Enabling Verbose Logging
---

# How to enable verbose logging?
Verbose logging is disabled by default but could be useful to debug some issues you may encounter.
There are two ways to access the logs:

1. Inside WebSSH
2. In the file system (useful for crashes)

## Inside WebSSH
1. Launch WebSSH
2. Go to Settings menu (gear icon top left)
3. Choose Logs entry menu
4. Choose "debug" in the level contextual menu

## File System (useful for crashes)
### iOS
1. iOS Settings
2. WebSSH
3. Settings
4. WebSSH > File Logger Level > Verbose
5. Restart WebSSH
6. Reproduce your action
7. Find the log files inside iOS > Files > WebSSH

### macOS
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