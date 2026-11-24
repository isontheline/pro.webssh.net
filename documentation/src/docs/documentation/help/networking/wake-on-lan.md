---
title: Wake-on-LAN
description: "Power on a computer or server remotely with a Wake-on-LAN magic packet from WebSSH: enable the role on your server, enter its MAC address and wake it up."
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

## Wake up a device from Apple Shortcuts[^2]
The **Send Wake-on-LAN Packet** action of the Shortcuts app sends the magic packet without opening WebSSH. Use it in a shortcut, a Home Screen icon, a widget, a personal automation, or ask Siri: *“Wake a device with WebSSH”*.

1. Open **Shortcuts** and create a new shortcut
2. Search for **WebSSH** in the action list and add **Send Wake-on-LAN Packet**
3. Choose the **Target**:
    - **Saved Server**: pick a server that has the Wake-on-LAN role and a MAC address. The MAC address and the port are read from the server each time the shortcut runs.
    - **Mac Address**: type the MAC address of the device
4. Optional: set a **Broadcast Address** and a **Port**. Left empty, WebSSH uses the broadcast address of the current Wi-Fi network and the port saved on the server (9 for a typed MAC address).

The action returns *true* when the magic packet has left your device and *false* otherwise, so the next actions can test it with **If**. Wake-on-LAN has no acknowledgement: *true* does not prove that the machine has woken up.

To wake a machine and connect to it, chain **Send Wake-on-LAN Packet**, **Wait** (30 to 90 seconds) and **Open URLs** with a [deep link](/documentation/help/howtos/use-deep-linking/) to the server.

??? info "Local network"
    The magic packet is sent from your device: it must be on the same local network as the machine, and WebSSH must be allowed to access the local network (iOS Settings → Privacy & Security → Local Network). If the action reports that the packet could not be sent, wake a server once from the app to get the permission prompt.

[^1]: Available since WebSSH 29.2
[^2]: Available since WebSSH 33.5