---
title: Lockdown Mode and Custom Fonts
---

# Lockdown Mode and Custom Fonts

!!! tip "Did you know?"
    Lockdown mode does not allow custom fonts so WebSSH can't render properly the MesloLGSNF Web Font.

When using iOS 16 or greater, new lockdown mode make the font in the SSH shell very hard to read.

You need to change the "Custom Fonts Strategy" inside the WebSSH settings :

* Open iOS Settings
* Go to WebSSH Settings (bottom of settings)
* Go to "SSH" section
* Change "Custom Fonts Strategy" value to "Disallow"