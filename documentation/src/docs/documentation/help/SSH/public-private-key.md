---
title: Public / Private Key
---

# Public / Private Key
SSH (Secure Shell) is a widely used protocol for secure communication over unsecured networks. It is commonly used for remote login, remote command execution, and file transfer. One of the main features of SSH is the use of public-key cryptography to authenticate users and encrypt data.

In SSH public key authentication, the user generates a pair of keys: a public key and a private key. The public key is shared with the server, while the private key is kept on the user's device. When the user attempts to connect to the server, the server sends a challenge message encrypted with the user's public key. The user decrypts the message with their private key, and sends the decrypted message back to the server. If the message matches the server's challenge, the user is authenticated.

It is important to protect the private key part with a passphrase. The passphrase acts as an additional layer of security to prevent unauthorized access to the private key. Without the passphrase, anyone who gains access to the user's device can potentially use the private key to connect to the server.

The public key part, on the other hand, is stored on the server and can be shared with other users or servers without compromising the security of the private key. It is safe to share the public key because it can only be used to encrypt messages that can only be decrypted by the corresponding private key.

In summary, SSH public key authentication is a secure way to authenticate users and encrypt data over unsecured networks. The private key should be protected with a passphrase to prevent unauthorized access, while the public key can be shared with other users and servers. 

**Always remember to keep the private key on your device and never share it with anyone.**

## Public Key
SSH public key format is a standardized format that allows for interoperability between different SSH implementations. There are several different SSH public key formats, but the two most commonly used formats are OpenSSH and RFC4716. 

**WebSSH supports only OpenSSH format for Public Keys.**

Here is an example of an OpenSSH public key:

```
ssh-rsa AAAAB3NzaC1yc2EAAA... user@host
```

## Private Key
SSH private key format is also a standardized format that allows for interoperability between different SSH implementations. There are several different SSH private key formats, but **WebSSH supports OpenSSH and PuTTY ones**.

Here is an example of an OpenSSH private key:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCYtgSfCcNwsC/yfw7HFFEdp0zTK7w/GR+MCZbH0Z9XQAAAJi2BJ8Jw3CwL
/J/hsUUR2nTNMrvD8ZH4wJlsfRn1dAAAAE2R1ZHVBbGxvdyAoS2VubmVkeSB0aGlzIHNlY3Vy
H1CnU6Rh7Z6zGw==
-----END OPENSSH PRIVATE KEY-----
```

Here is an example of a PuTTY private key:

```
PuTTY-User-Key-File-2: ssh-rsa
Encryption: none
Comment: rsa-key-20230415
Public-Lines: 6
AAAAB3NzaC1yc2EAAAADAQABAAABAQDhskNQOvkgBAWmjypFOK9VV+mF5EC5V5
59uy/eOX1vNV8MxWQFkOPzbSK0T0rHr8K/pwkNBYbEk+OzSLQjvO8xNsbZ
```

### Private Keys Algorithms
There are several SSH private key algorithms that can be used, depending on the implementation and version of the SSH protocol being used. Here are some of the most common ones :

| Algorithm | Description | Is it secure? |
| --- | --- | --- |
| RSA (Rivest-Shamir-Adleman) | This is the most commonly used algorithm for SSH private keys. It is a widely used public-key cryptography algorithm that is known for its security and speed. | Yes but it's not recommended to use RSA keys smaller than 2048 bits. |
| DSA (Digital Signature Algorithm) | This is another commonly used algorithm for SSH private keys. It is also a public-key cryptography algorithm that is known for its speed. | :x: No, it's considered insecure. |
| ECDSA (Elliptic Curve Digital Signature Algorithm) | This is a newer algorithm that is becoming more popular for SSH private keys. It is based on elliptic curve cryptography, which offers a higher level of security than RSA and DSA. | Yes |
| Ed25519 | This is another newer algorithm that is gaining popularity for SSH private keys. It is based on elliptic curve cryptography and is designed to be faster and more secure than RSA, DSA, and ECDSA. | Yes |

WebSSH supports all of these algorithms but it's not recommended to use DSA because it's considered insecure. 

To enhance security, it is recommended to use a strong algorithm and to keep your private key protected with a strong passphrase.