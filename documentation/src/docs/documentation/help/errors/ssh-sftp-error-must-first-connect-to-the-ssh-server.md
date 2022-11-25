---
title: Must first connect to the SSH server
description: This error may happen after a long period of inactivity or at connection if your have an SFTP server error.
---

# SSH / SFTP Error : Must first connect to the SSH server
This error may happen after a long period of inactivity.

Perhaps you have successfully connected and authenticated with the SFTP server, did some actions (file browsing, etc.), and then don't do anything else for a long period of time. 

Meanwhile, the SFTP server decides to disconnect because WebSSH has been inactive for too long.

!!! info "Error occurs when launching the SFTP connection"
    If this error occurs when you connect to your SFTP server then you may have a misconfiguration on your side.

    Please double check your SFTP server configuration and make a look at the connection logs on the server.