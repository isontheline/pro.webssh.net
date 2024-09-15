---
title: "Supported Algorithms"
---

# Supported Algorithms
??? tip "SSH Config Tips"
    You can enable or disable algorithms using the `Ciphers`, `HostKeyAlgorithms`, `KexAlgorithms` and `MACs` keywords in your [ssh_config](/documentation/help/SSH/ssh-config-file/) file.

    For example, to enable the `ecdh-sha2-nistp521` key exchange algorithm, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        KexAlgorithms +ecdh-sha2-nistp521
    ```

    To disable `aes128-ctr` cipher, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        Ciphers -aes128-ctr
    ```

    To set only `ssh-rsa` and `ssh-ed25519` host key algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        HostKeyAlgorithms +ssh-rsa,+ssh-ed25519
    ```
    
    `^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable algorithms without changing the default ones.

## Ciphers
The supported ciphers are :

* chacha20-poly1305@openssh.com
* aes128-ctr
* aes256-ctr
* aes192-ctr
* aes128-cbc
* aes256-cbc
* aes192-cbc
* aes128-gcm@openssh.com
* aes256-gcm@openssh.com
* twofish256-cbc
* twofish128-cbc
* blowfish-cbc

The default enabled are :

* aes128-ctr
* aes256-ctr
* aes128-gcm@openssh.com
* aes256-gcm@openssh.com

## HostKeyAlgorithms
The supported host key algorithms are :

* ecdsa-sha2-nistp256
* ecdsa-sha2-nistp384
* ecdsa-sha2-nistp521
* ssh-ed25519
* rsa-sha2-256
* rsa-sha2-512
* ssh-rsa
* ssh-dss

The default enabled are :

* ssh-ed25519
* rsa-sha2-256
* rsa-sha2-512

`^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable host key algorithms without changing the default ones.

## KexAlgorithms
The supported key exchange algorithms are :

* curve25519-sha256
* curve25519-sha256@libssh.org
* ecdh-sha2-nistp256
* ecdh-sha2-nistp384
* ecdh-sha2-nistp521
* diffie-hellman-group14-sha256
* diffie-hellman-group16-sha512
* diffie-hellman-group18-sha512
* diffie-hellman-group-exchange-sha256
* diffie-hellman-group1-sha1
* diffie-hellman-group14-sha1
* diffie-hellman-group-exchange-sha1

The default enabled are :

* curve25519-sha256
* curve25519-sha256@libssh.org
* diffie-hellman-group16-sha512
* diffie-hellman-group18-sha512
* diffie-hellman-group-exchange-sha256

`^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable key exchange algorithms without changing the default ones.

## MACs
The supported MACs are :

* hmac-sha2-256
* hmac-sha2-512
* hmac-sha2-256-etm@openssh.com
* hmac-sha2-512-etm@openssh.com
* hmac-sha1-etm@openssh.com
* hmac-sha1
* hmac-ripemd160
* hmac-sha1-96
* hmac-md5

The default enabled are :

* hmac-sha2-256-etm@openssh.com
* hmac-sha2-512-etm@openssh.com