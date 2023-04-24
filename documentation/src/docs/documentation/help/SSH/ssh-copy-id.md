---
title: "ssh-copy-id"
---

# ssh-copy-id : Copy your public key to a remote machine
On computers with SSH installed, you can use the `ssh-copy-id` command to copy your public key to a remote machine. This is useful if you want to use SSH keys to log in to a remote machine without having to type in your password every time.

On WebSSH[^1] there is no `ssh-copy-id` command, but instead there is a graphical interface that allows you to copy your public key to a remote machine.

To use it simply follow these steps:

1. Launch a connection (with password or already known key)
2. Use "..." ellipsis top right button on the terminal
3. Choose "Tools" submenu
4. Choose ssh-copy-id
5. Choose the Private Key you want to have it's Public Key sent to .ssh/authorized_keys
6. Confirm that you want to setup your Public Key and you will obtain a success (or error) message
7. Go back to the terminal
8. Disconnect from the remote machine
9. Use your Private Key to connect again

??? warning "Public Key Generation"
    Public Key Generation is handled by WebSSH. If the Public Key is missing, WebSSH will generate it for you but only if your Private Key is not protected by a passphrase.
    
    If your private key is protected by a passphrase : at step five (5) long press / right click to generate a public key. You will be asked for your passphrase in order to decrypt your private key and generate the public key.

[^1]: Since WebSSH 21.8