---
title: Unable to agree upon client-to-server Error
description: Happen when client and server do not share any common secure algorithms.
---

# Unable to agree upon client-to-server Error
When WebSSH connects to your server, it utilizes the latest security algorithms to establish a secure connection between your device and the server. This ensures that your data is protected using advanced, reliable protocols designed to safeguard your information.

To further enhance security, WebSSH has disabled older, less secure algorithms by default. This change protects users from potential vulnerabilities and known security flaws, such as the Terrapin Attack, which could compromise connection integrity if weak algorithms are used.

If your server only supports some of these outdated or weak algorithms, you may experience connectivity issues when trying to establish a connection with WebSSH. In such cases, updating your server’s accepted algorithms is recommended to ensure compatibility and maintain a secure link with WebSSH.

## (Re)Enable Weak Algortihms
In versions prior to WebSSH 27.10, updating your ssh_config file was necessary to regain access to your server if it required weak algorithms. With WebSSH 27.10 and later, you now have the option to (re)enable weak algorithms directly within the app settings.

To enable weak algorithms, follow these steps:

1.	Open WebSSH Settings
2.	Navigate to Security
3.	Select Weak Algorithms Strategy
4.	Choose Allow Weak Algorithms

After enabling this setting, you’ll be able to connect to your servers as before. However, keep in mind that this option reduces connection security, as weak algorithms are being used to establish the connection.

??? abstract "Related Errors"
    - No matching mac algorithms supported
    - Unable to agree upon server-to-client MAC algorithm
    - Failed to read KEX init response
    - Socket connection closed