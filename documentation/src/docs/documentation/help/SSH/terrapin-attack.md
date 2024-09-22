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
* deprecated ETM MAC algorithms

## Enable ETM MAC and ChaCha20 algorithms
If you need to re-enable ETM MAC and ChaCha20 algorithms again (eg in case your server only accepts some ETM MAC algorithms), you can do it by adding the following lines to your [SSH Config File](/documentation/help/SSH/ssh-config-file/) :

```bash
# If using WebSSH 27.4 or later :
Host *
    Ciphers +chacha20-poly1305@openssh.com
    MACs +hmac-sha1-etm@openssh.com

# If using WebSSH 24.8 to 27.3 :
Host *
     #!Enable-HMAC-ETM
```