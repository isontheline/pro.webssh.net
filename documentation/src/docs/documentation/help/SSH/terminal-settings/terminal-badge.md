---
title: Terminal Badge
---

# Terminal Badge

> Instantly know where you are, every time you open a terminal.  
> Display key info right in your SSH sessions—automatically, securely, and with style.

## What is a WebSSH Badge?

**WebSSH Badge** displays important contextual information—like your server name, environment, or custom notes—at the top of your terminal session. It helps you quickly recognize your connection and avoid mistakes (like running a command on production instead of dev).

## How to Set Up Your Badge
1. Edit your SSH connection in WebSSH
2. Go to "Terminal Settings"
3. Tap on "Badge Content"
4. Fill a custom badge content
5. Save your changes

## How to change your Badge Color
1. Go to WebSSH Settings :gear:
2. Scroll to edit "/etc/ssh/ssh_config"
3. Add the line `#!BadgeColor YOUR_COLOR` (e.g., `#!BadgeColor red`) to your host configuration
4. Save your changes
5. Relaunch your SSH connection to see the new badge color

More information about the SSH Config File is available [here](/documentation/help/SSH/ssh-config-file/#special-features).

## How to change Badge Font Size
1. Follow the same steps as above
2. Add the line `#!BadgeFontSize YOUR_SIZE` (e.g., `#!BadgeFontSize 14`) to your host configuration
3. Save your changes
4. Relaunch your SSH connection to see the new badge font size

## Set Badge Content Programmatically
You can set the badge content programmatically using the `#!BadgeContent` special feature in your SSH config file. This allows you to display different information based on the host by defining it in your SSH config file.
For example:
```ssh
Host myserver
    Hostname myserver.example.com
    User myuser
    #!BadgeContent "My Server - Production"
```