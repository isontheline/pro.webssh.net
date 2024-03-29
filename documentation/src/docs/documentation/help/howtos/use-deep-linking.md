---
title: Deep Linking
---

# Deep Linking

??? warning "Deep Links could harm your device"
    * Deep links are a way to open WebSSH within a browser. They are very useful to open a specific connection in WebSSH. However, they could also be used to do malicious things. Be careful when you click on a link you don't trust.
    * In order to prevent malicious links, WebSSH will ask you to confirm the connection before opening it. You can disable this confirmation in WebSSH > Settings > "Deep Linking Strategy"

* Since version 21.4, WebSSH supports deep linking. This means that you can open a SSH connection directly from a link.
* Since 21.6 you can also use deep linking feature to be able to launch a one time connection from the Search Bar (issue [#833](https://github.com/isontheline/pro.webssh.net/issues/833))

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
| `save` | If set to `true`, the connection will be saved in the connection list | `ssh://username@host:port?save=true` |
| `name` | The name of the connection | `ssh://username@host:port?name=My%20Connection` |
| `group` | The group of the connection | `ssh://username@host:port?group=My%20Group` |
| `tags` | The tags of the connection | `ssh://username@host:port?tags=tag1,tag2` |
| `key`| The Private Key name you would like to use to establish the connection. This parameter is case insensitive. Your Private Keys' name should be unique in order to be used with this parameter. | `ssh://username@host?key=MYPKEY`|

You can combine multiple options in the same link. Here is an example:

```
ssh://username@host:port?save=true&name=My%20Connection&group=My%20Group&tags=tag1,tag2
```

## Disabling opening confirmation
If you want to disable the confirmation dialog when opening a deep link, you can do it in WebSSH settings :

* Under iOS / iPadOS, go to "iOS Settings" > "WebSSH" > "Deep Linking Strategy" > "Always Allow"
* Under macOS, go to "WebSSH Menu" > "Preferences" > "Deep Linking Strategy" > "Always Allow"

## Using SFTP deep links
You just need to replace `ssh` by `sftp` in the link. Here is an example:

```
sftp://username@host:port
```

## Another app is using the ssh:// scheme
If you have another app that uses the `ssh://` scheme, you can use the `webssh://` scheme instead. So you can use the deep linking feature with WebSSH without removing the other app.

Here is an example:

```
webssh://username@host:port
```