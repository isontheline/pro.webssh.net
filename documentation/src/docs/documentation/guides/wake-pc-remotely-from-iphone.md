---
title: "Wake Your PC or Server from iPhone with Wake-on-LAN"
description: "Turn on a PC, NAS or home server from your iPhone with Wake-on-LAN in WebSSH, then SSH straight in. BIOS and OS setup, MAC address, waking from outside your LAN."
---

# How to Wake Your PC or Server Remotely from iPhone (Wake-on-LAN)

A machine that is powered off costs nothing to run, but it is also unreachable. **Wake-on-LAN** fixes that: a special network packet, the *magic packet*, tells the network card to power the machine on. **WebSSH** can send it from your iPhone, so the workflow becomes: wake the server, wait a minute, SSH in, do the work, shut it down again.

This guide covers preparing the machine, configuring WebSSH, and the one thing everyone gets stuck on: waking a machine when you are not at home.

## How Wake-on-LAN Works

The magic packet is broadcast on the local network and contains the target's **MAC address** repeated sixteen times. The network card listens for it even while the computer is off, as long as it still has standby power, which is why it works over **wired Ethernet** and almost never over Wi-Fi.

## Step 1: Enable Wake-on-LAN on the Machine

**In the BIOS or UEFI:** look for *Wake on LAN*, *Power On by PCI-E* or *Resume by LAN*, usually under Power Management, and enable it. On some boards you also need to disable *ErP* or *Deep Sleep* modes.

**Linux:**

```bash
sudo ethtool eth0 | grep Wake-on      # "g" means magic packet is supported
sudo ethtool -s eth0 wol g            # enable it
```

Make it persistent with a systemd unit or your network manager's `wake-on-lan` setting, otherwise it resets at boot.

**Windows:** Device Manager → your network adapter → Power Management → *Allow this device to wake the computer* and *Only allow a magic packet*. Also turn off **Fast Startup** in Power Options, which otherwise puts the card in a state that ignores packets.

**macOS:** System Settings → Energy → *Wake for network access*.

**Synology, QNAP and other NAS:** Control Panel → Hardware & Power → enable *WOL on LAN 1*.

## Step 2: Find the MAC Address

```bash
ip link show eth0          # Linux: the "link/ether" line
ifconfig en0 | grep ether  # macOS
ipconfig /all              # Windows: "Physical Address"
```

It looks like `A8:5E:45:12:34:56`.

## Step 3: Configure WebSSH

Wake-on-LAN is a **role** you add to an existing connection (available since WebSSH 29.2):

1. Edit the connection of the machine you want to wake
2. Open the **Roles** section
3. Enable **Wake-on-LAN** and save the roles
4. Enter the **MAC address**
5. Save the connection

See [Wake-on-LAN](/documentation/help/networking/wake-on-lan/).

## Step 4: Wake It and Connect

1. Open the connection's context menu in the server list
2. In the **Launch** section, choose **Wake-on-LAN**
3. Wait 30 to 90 seconds for the machine to boot
4. Launch the SSH role of the same connection

!!! tip "Check when it is up"
    Use the **Ping** tool in WebSSH while the machine boots. As soon as it answers, SSH is usually a few seconds away.

## Waking a Machine from Outside Your Network

The magic packet is a **broadcast** and broadcasts do not cross the internet, and usually not VPNs either. Three ways around it, from simplest to most robust:

**Option 1: Send the packet from a device that is always on.** A Raspberry Pi, a router running OpenWrt, a NAS: SSH into it from WebSSH and send the packet from there:

```bash
sudo apt install wakeonlan       # or etherwake
wakeonlan A8:5E:45:12:34:56
```

Turn it into a [snippet](/documentation/help/howtos/snippets/) on that connection:

```bash
wakeonlan {{{ MAC : A8:5E:45:12:34:56 }}}
```

**Option 2: Add the Wake-on-LAN role to a jump host.** If your always-on device is already the jump host you use to reach the network, this is the same idea with fewer taps.

**Option 3: Router with a Wake-on-LAN feature.** Many routers can send the packet from their admin interface. Reach that interface securely through an [SSH tunnel](/documentation/guides/port-forwarding-ios/) instead of exposing it to the internet.

## Shutting Down Afterwards

Once the work is done, from the SSH session:

```bash
sudo systemctl poweroff       # Linux
sudo shutdown -h now          # macOS, BSD
shutdown /s /t 0              # Windows (OpenSSH)
```

## Troubleshooting

??? question "The machine wakes from sleep but not from a full shutdown"
    Standby power to the network card is disabled after a full power-off. Check the BIOS for *ErP*, *Deep Sleep* or *EuP* settings and disable them. On Windows, turn off Fast Startup.

??? question "It worked once, then never again"
    On Linux the `ethtool -s eth0 wol g` setting is lost at reboot; make it persistent. On Windows, Fast Startup or a driver update can reset the adapter's power settings.

??? question "Nothing happens over Wi-Fi"
    Most Wi-Fi adapters cannot receive a magic packet while the machine is off. Use a wired connection for the machine you want to wake.

??? question "It works at home but not from outside"
    Expected: the packet is a local broadcast. Send it from an always-on device inside the network as described above.

## Related Guides

- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [Access your homelab via SSH tunnel on iOS](/documentation/guides/homelab-ssh-tunnel-ios/)
- [SSH into a Raspberry Pi from iPhone or iPad](/documentation/guides/raspberry-pi-ssh-ios/)
- [SSH to Synology NAS from iPhone or iPad](/documentation/guides/synology-ssh-iphone-ipad/)

## Frequently Asked Questions

### Can I turn on my PC from my iPhone?

Yes, with Wake-on-LAN. Enable it in the PC's BIOS and operating system, add the Wake-on-LAN role with the PC's MAC address to its connection in WebSSH, then choose Wake-on-LAN in the connection's Launch menu. The PC must be on wired Ethernet and on the same network as your iPhone, or you send the packet from an always-on device inside that network.

### Does Wake-on-LAN work over Wi-Fi?

Almost never. Most Wi-Fi adapters are powered down when the computer is off and cannot receive the magic packet. Connect the machine you want to wake with an Ethernet cable.

### How do I wake my server when I am not at home?

The magic packet is a local broadcast and does not cross the internet. SSH from WebSSH into a device that is always on at home, such as a Raspberry Pi, a NAS or an OpenWrt router, and run wakeonlan with the server's MAC address from there. A WebSSH snippet makes it one tap.

### Where do I find the MAC address of my computer?

On Linux run ip link show, on macOS ifconfig en0, on Windows ipconfig /all and read the Physical Address. It is a 12-digit hexadecimal value such as A8:5E:45:12:34:56.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I turn on my PC from my iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, with Wake-on-LAN. Enable it in the PC's BIOS and operating system, add the Wake-on-LAN role with the PC's MAC address to its connection in WebSSH, then choose Wake-on-LAN in the connection's Launch menu. The PC must be on wired Ethernet and on the same network as your iPhone, or you send the packet from an always-on device inside that network."
      }
    },
    {
      "@type": "Question",
      "name": "Does Wake-on-LAN work over Wi-Fi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Almost never. Most Wi-Fi adapters are powered down when the computer is off and cannot receive the magic packet. Connect the machine you want to wake with an Ethernet cable."
      }
    },
    {
      "@type": "Question",
      "name": "How do I wake my server when I am not at home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The magic packet is a local broadcast and does not cross the internet. SSH from WebSSH into a device that is always on at home, such as a Raspberry Pi, a NAS or an OpenWrt router, and run wakeonlan with the server's MAC address from there. A WebSSH snippet makes it one tap."
      }
    },
    {
      "@type": "Question",
      "name": "Where do I find the MAC address of my computer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "On Linux run ip link show, on macOS ifconfig en0, on Windows ipconfig /all and read the Physical Address. It is a 12-digit hexadecimal value such as A8:5E:45:12:34:56."
      }
    }
  ]
}
</script>
