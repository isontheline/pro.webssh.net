---
title: Checking Host Availability
---

??? danger "This feature can harm your server / provider"
    By making a lot of connection attempts in order to check if your host is available on your SSH port, WebSSH can harm your server / provider. This is why this feature is disabled by default. You can enable it in the WebSSH Settings.

# Checking Host Availability
When enabling this feature, WebSSH will periodically - every 20 seconds - check the availability of your hosts :

* If the host is not available, then an red icon will be displayed next to the host name in the host list. 
* If the host is available, then a blue icon will be displayed instead.

## How does it work?
WebSSH check if the host is available by trying to connect to it on the port you specified in the host configuration (default 22). Ping isn't used at this time of writing.

## Why my provider block my connection after using WebSSH?
If you have enabled this feature, then your provider may block your connection after a while. This is because WebSSH is trying to connect to your host every 20 seconds. Disable this feature in the WebSSH Settings to prevent this.