---
title: Deep Linking
---

# Deep Linking

??? warning "Deep Links could harm your device"
    * Deep links are a way to open WebSSH within a browser. They are very useful to open a specific connection in WebSSH. However, they could also be used to do malicious things. Be careful when you click on a link you don't trust.
    * In order to prevent malicious links, WebSSH will ask you to confirm the connection before opening it. You can disable this confirmation in WebSSH settings.

Since version 21.4, WebSSH supports deep linking. This means that you can open a SSH connection directly from a link.

## How to use it
To use deep linking, you need to create a link with the following format:

```
ssh://username@host:port
```

Username and host are mandatory, port is optional. If you don't specify a port, WebSSH will use the default port (22).

## Advanced usage
You can also specify some options to customize the connection. Here is the list of available options:

| Option | Description | Example |
| --- | --- | --- |
| `save` | If set to `true`, the connection will be saved in the connection list. | `ssh://username@host:port?save=true` |
| `name` | The name of the connection. | `ssh://username@host:port?name=My%20Connection` |
| `group` | The group of the connection. | `ssh://username@host:port?group=My%20Group` |
| `tags` | The tags of the connection. | `ssh://username@host:port?tags=tag1,tag2` |

You can combine multiple options in the same link. Here is an example:

```
ssh://username@host:port?save=true&name=My%20Connection&group=My%20Group&tags=tag1,tag2
```

## Disabling opening confirmation
If you want to disable the confirmation dialog when opening a deep link, you can do it in WebSSH settings :

* Under iOS / iPadOS, go to "iOS Settings" > "WebSSH" > "Deep Linking Strategy" > "Always Allow"
* Under macOS, go to "WebSSH Menu" > "Preferences" > "Deep Linking Strategy" > "Always Allow"