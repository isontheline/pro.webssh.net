---
title: WebSSH Deep Linking
---

# WebSSH Deep Linking
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