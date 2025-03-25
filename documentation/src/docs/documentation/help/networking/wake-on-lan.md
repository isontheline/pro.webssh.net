---
title: Wake-on-LAN
---

# Wake-on-LAN[^1]
Wake-on-LAN (WoL) is a networking standard that allows a computer or other device to be powered on remotely by sending a special network message known as a “magic packet.” This feature is especially useful for system administrators and remote users who need to access machines without being physically present. It’s commonly used to save energy by keeping systems off when not in use, yet still accessible when needed.

To enable WoL inside WebSSH, you need to have the MAC address of the device you want to wake up. You can find the MAC address in the device’s network settings.

## Steps to configure WoL in WebSSH
1. Edit your server settings
2. Go to "Roles" section
3. Enable "Wake-on-LAN" optional feature
4. Save the roles
5. Put the MAC address of the device you want to wake up
6. Save the server settings

## Wake up a device
Just launch the context menu on the server and select "Wake-on-LAN" from the "Launch" section.

[^1]: Available since WebSSH 29.2