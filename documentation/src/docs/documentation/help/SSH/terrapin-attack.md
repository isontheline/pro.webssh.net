---
title: "Terrapin Attack"
---

# Terrapin Attack
## What is that?
Quotes from [terrapin-attack.com](https://terrapin-attack.com) :
> Terrapin is a prefix truncation attack targeting the SSH protocol. More precisely, Terrapin breaks the integrity of SSH's secure channel. By carefully adjusting the sequence numbers during the handshake, an attacker can remove an arbitrary amount of messages sent by the client or server at the beginning of the secure channel without the client or server noticing it.

> If your SSH implementations supports (and is configured to offer) the chacha20-poly1305@openssh.com encryption algorithm, or any encryption algorithm suffixed -cbc in combination with any MAC algorithm suffixed -etm@openssh.com, you are vulnerable to Terrapin.

## WebSSH mitigation
In order to protect WebSSH users against Terrapin Attack flaw, we have disabled the following algorithms since WebSSH 24.8 :

* chacha20-poly1305@openssh.com encryption algorithm
* all ETM MAC algorithms

## (Re) Enable ETM MAC algorithms
If you need to enable ETM MAC algorithms again (eg in case your server only accepts ETM MAC algorithms), you can do it by adding the following lines to your SSH Config File :

```bash
Host *
    #!Enable-HMAC-ETM
```