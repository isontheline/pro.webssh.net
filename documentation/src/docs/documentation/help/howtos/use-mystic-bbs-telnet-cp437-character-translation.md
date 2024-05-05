---
title: Use Mystic BBS with Telnet CP437 codepage
---

# Use Mystic BBS with Telnet CP437 codepage
By default WebSSH uses UTF-8 encoding to display characters. However, some BBS systems like Mystic BBS use the CP437 codepage. This can lead to display issues when connecting to a Mystic BBS system :

![isontheline maintainer of WebSSH](/images/md-content/dogtown-bbs-venice-ca-bad-render.jpg)

# How to fix it
## Use the CP437 Remote Character Set
Inside your ssh_config file, you need to define a RemoteCharacterSet property in order to use the CP437 codepage. Here is an example of a ssh_config file :

```ssh
Host my-mystic-bbs-server-name
    #!RemoteCharacterSet CP437
```

## Fix the window size
Most telnet systems like Mystic BBS uses a 80x24 window size. You can define a fixed window size in your ssh_config file :

```ssh
Host my-mystic-bbs-server-name
    #!RemoteCharacterSet CP437
    #!FixedSize 80x24
```

You will now be able to enjoy your Mystic BBS system with the correct CP437 codepage :
![isontheline maintainer of WebSSH](/images/md-content/dogtown-bbs-venice-ca-good-render.jpg)