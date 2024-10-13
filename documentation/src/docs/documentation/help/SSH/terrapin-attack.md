---
title: "Terrapin Attack"
---

# Terrapin Attack
??? abstract "What is that?"
    Quotes from [terrapin-attack.com](https://terrapin-attack.com) :
    > Terrapin is a prefix truncation attack targeting the SSH protocol. More precisely, Terrapin breaks the integrity of SSH's secure channel. By carefully adjusting the sequence numbers during the handshake, an attacker can remove an arbitrary amount of messages sent by the client or server at the beginning of the secure channel without the client or server noticing it.

    > If your SSH implementations supports (and is configured to offer) the chacha20-poly1305@openssh.com encryption algorithm, or any encryption algorithm suffixed -cbc in combination with any MAC algorithm suffixed -etm@openssh.com, you are vulnerable to Terrapin.

??? question "Why can't I connect to my server anymore?"
    When WebSSH connects to your server, it uses the latest security algorithms to ensure the best security between your device and your server. In order to protect you against security flaws, like Terrapin Attack, weak algorithms have been disabled by default. If your server only accepts some of these weak algorithms, you may not be able to connect to your server anymore.

In order to protect WebSSH users against Terrapin Attack flaw, weak algorithms have been disabled by default. Review the [Supported Algorithms](/documentation/help/SSH/supported-algorithms/) to check which algorithms are supported and enabled by default.

## (Re)Enable ETM MAC and ChaCha20 algorithms
If you need to re-enable ETM MAC and ChaCha20 algorithms again (eg in case your server only accepts some ETM MAC algorithms), you can do it by adding the following lines to your [SSH Config File](/documentation/help/SSH/ssh-config-file/) :

```bash
Host *
    Ciphers +chacha20-poly1305@openssh.com
    MACs +hmac-sha1-etm@openssh.com
```

## (Re)Enable all algorithms
If you need to enable all algorithms, you can do it by adding the following lines to your [SSH Config File](/documentation/help/SSH/ssh-config-file/) :

```bash
Host *
    Ciphers chacha20-poly1305@openssh.com,aes128-ctr,aes256-ctr,aes192-ctr,aes128-cbc,aes256-cbc,aes192-cbc,aes128-gcm@openssh.com,aes256-gcm@openssh.com,twofish256-cbc,twofish128-cbc,blowfish-cbc
    HostKeyAlgorithms ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521,ssh-ed25519,rsa-sha2-256,rsa-sha2-512,ssh-rsa,ssh-dss
    KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hellman-group-exchange-sha256,diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1
    MACs hmac-sha2-256,hmac-sha2-512,hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha1-etm@openssh.com,hmac-sha1,hmac-ripemd160,hmac-sha1-96,hmac-md5
```

??? warning "Weak Algorithms Warning"
    Enabling weak algorithms can lead to security issues. Please make sure you know what you are doing before enabling weak algorithms. Make an audit of your client and server security before and after enabling algorithms : [ssh-audit.com](https://www.ssh-audit.com)