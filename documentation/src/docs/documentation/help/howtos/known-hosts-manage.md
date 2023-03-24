---
title: Managing Known Hosts
---

# Known Hosts
Known hosts are the hosts that you have already connected to. They are stored inside the app database on your device and are used to verify the authenticity of the host you are connecting to. 

If you are connecting to a host for the first time, you will be asked to verify the authenticity of the host. If you are connecting to a host that you have already connected to, you will not be asked to verify the authenticity of the host.

If you are connecting to a host that you have already connected to, but the host key has changed, you will be asked to verify the authenticity of the host.

## How to manage known hosts?
Yet there is no way to manage known hosts inside WebSSH. You can only delete all known hosts at once or delete a single one.

### Deleting all known hosts
1. Launch WebSSH
2. Launch mashREPL
3. Execute `webssh fingerprint clean all`

### Deleting a single known host
1. Launch WebSSH
2. Launch mashREPL
3. Execute `webssh fingerprint clean <host>`