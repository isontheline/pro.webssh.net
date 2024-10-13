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
| Algorithm                        | Default Status |
|-----------------------------------|----------------|
| chacha20-poly1305@openssh.com     | ❌             |
| aes128-ctr                        | ✅             |
| aes256-ctr                        | ✅             |
| aes192-ctr                        | ❌             |
| aes128-cbc                        | ❌             |
| aes256-cbc                        | ❌             |
| aes192-cbc                        | ❌             |
| aes128-gcm@openssh.com            | ✅             |
| aes256-gcm@openssh.com            | ✅             |
| twofish256-cbc                    | ❌             |
| twofish128-cbc                    | ❌             |
| blowfish-cbc                      | ❌             |

??? tip "Need to enable one or more ciphers?"
    You can enable or disable ciphers using the `Ciphers` keyword in your [ssh_config](/documentation/help/SSH/ssh-config-file/) file.

    For example, to enable the `aes192-cbc` cipher, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        Ciphers +aes192-cbc
    ```

    To disable `twofish256-cbc` and `twofish128-cbc` ciphers, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        Ciphers -twofish256-cbc,-twofish128-cbc
    ```

    To set only `aes128-ctr` and `aes256-ctr` ciphers, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        Ciphers aes128-ctr,aes256-ctr
    ```

## HostKeyAlgorithms
| Algorithm                        | Default Status |
|----------------------------------|----------------|
| ecdsa-sha2-nistp256              | ❌             |
| ecdsa-sha2-nistp384              | ❌             |
| ecdsa-sha2-nistp521              | ❌             |
| ssh-ed25519                      | ✅             |
| rsa-sha2-256                     | ✅             |
| rsa-sha2-512                     | ✅             |
| ssh-rsa                          | ❌             |
| ssh-dss                          | ❌             |

??? tip "Need to enable one or more host key algorithms?"
    You can enable or disable host key algorithms using the `HostKeyAlgorithms` keyword in your [ssh_config](/documentation/help/SSH/ssh-config-file/) file.

    For example, to enable the `ecdsa-sha2-nistp521` host key algorithm, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        HostKeyAlgorithms +ecdsa-sha2-nistp521
    ```

    To disable `ssh-rsa` and `ssh-dss` host key algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        HostKeyAlgorithms -ssh-rsa,-ssh-dss
    ```

    To set only `ssh-rsa` and `ssh-ed25519` host key algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        HostKeyAlgorithms ssh-rsa,ssh-ed25519
    ```

## KexAlgorithms
| Algorithm                           | Default Status |
|-------------------------------------|----------------|
| curve25519-sha256                   | ✅             |
| curve25519-sha256@libssh.org        | ✅             |
| ecdh-sha2-nistp256                  | ❌             |
| ecdh-sha2-nistp384                  | ❌             |
| ecdh-sha2-nistp521                  | ❌             |
| diffie-hellman-group14-sha256       | ❌             |
| diffie-hellman-group16-sha512       | ✅             |
| diffie-hellman-group18-sha512       | ✅             |
| diffie-hellman-group-exchange-sha256| ✅             |
| diffie-hellman-group1-sha1          | ❌             |
| diffie-hellman-group14-sha1         | ❌             |
| diffie-hellman-group-exchange-sha1  | ❌             |

??? tip "Need to enable one or more key exchange algorithms?"
    You can enable or disable key exchange algorithms using the `KexAlgorithms` keyword in your [ssh_config](/documentation/help/SSH/ssh-config-file/) file.

    For example, to enable the `ecdh-sha2-nistp521` key exchange algorithm, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        KexAlgorithms +ecdh-sha2-nistp521
    ```

    To disable `diffie-hellman-group1-sha1`, `diffie-hellman-group14-sha1` and `diffie-hellman-group-exchange-sha1` key exchange algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        KexAlgorithms -diffie-hellman-group1-sha1
    ```

    To set only `curve25519-sha256` and `ecdh-sha2-nistp256` key exchange algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        KexAlgorithms curve25519-sha256,ecdh-sha2-nistp256
    ```

## MACs
| Algorithm                        | Default Status |
|----------------------------------|----------------|
| hmac-sha2-256                    | ❌             |
| hmac-sha2-512                    | ❌             |
| hmac-sha2-256-etm@openssh.com     | ✅             |
| hmac-sha2-512-etm@openssh.com     | ✅             |
| hmac-sha1-etm@openssh.com         | ❌             |
| hmac-sha1                         | ❌             |
| hmac-ripemd160                    | ❌             |
| hmac-sha1-96                      | ❌             |
| hmac-md5                          | ❌             |

??? tip "Need to enable one or more MAC algorithms?"
    You can enable or disable MAC algorithms using the `MACs` keyword in your [ssh_config](/documentation/help/SSH/ssh-config-file/) file.

    For example, to enable the `hmac-sha2-256` MAC algorithm, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        MACs +hmac-sha2-256
    ```

    To disable `hmac-sha1` and `hmac-ripemd160` MAC algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        MACs -hmac-sha1,-hmac-ripemd160
    ```

    To set only `hmac-sha2-256` and `hmac-sha2-512` MAC algorithms, you can add the following line to your `ssh_config` file :
    ```ssh_config
    Host *
        MACs hmac-sha2-256,hmac-sha2-512
    ```
    