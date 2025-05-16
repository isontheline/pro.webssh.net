---
title: Terminal State Bar
---
# Terminal State Bar
Since WebSSH 29.3 a "State Bar" is available at the bottom of the terminal. This bar is used to display dynamic information about anything you want, your are free to customize it as you want.

## How to customize the State Bar
1. Go to the "Settings" section of WebSSH (gear icon)
2. Tap on "State Bar" on the "SSH" section
3. Add or order the items you want to display in the State Bar
4. Tap on "Save" to right icon to save your changes

## What's an item?
An item is a piece of information that you can display in the State Bar. You can add as many items as you want, and you can also reorder them to your liking.

Items are defined by :

* **Name**: The name of the item, not displayed in the State Bar, only used to identify the item in the settings
* **Tags**: The tags of the item, used to link the item to one or more connections. Read more about [WebSSH Tags](/documentation/help/howtos/link-connections-using-tags/).
* **Icon**: The icon of the item, displayed in the State Bar
* **JavaScript**: The JavaScript code that will be executed to get the value of the item. The result of this code will be displayed in the State Bar.

## JavaScript Code
In order to build your item content, you need to write a small piece of JavaScript code. This code should return a Scalar (String, Integer, etc.) or even better an Item Result Object (see below) that will be displayed in the State Bar.

If you return an undefined value or a null value, the item will be hidden in the State Bar.

### Item Result Object
The Item Result Object is an object that contains the following properties:

* **label**: The text value of the item, this is the value that will be displayed in the State Bar. Fallback to empty string if not defined.
* **icon**: The icon of the item, this icon will be displayed in the State Bar. This property is optional. Refer to [SF Symbols](https://developer.apple.com/sf-symbols/) for the list of available icons. If not provided, the last icon set will be used.

### Exposed variables and functions
The JavascriptCode is running inside a sandbox, so you can't access the DOM or any other global variables. You can only use the following variables and functions:

* `$ssh.exec`: The SSH object used to execute commands on the remote server. You can use it to execute any command you want. Avoid long running commands. You should use as much as possible the [Linux `timeout`](https://www.man7.org/linux/man-pages/man1/timeout.1.html) command to limit the execution time of the command. Will return a String.
* `$ssh.isConnected`: A boolean that indicates if the SSH connection is established or not. Useful to display a message when the connection is lost.
* `$vars`: A special object that could be used to store variables that you want to share between runs of the JavaScript code. Could also be used to share data between items. This variable is not persistent, so it will be reset when the connection is closed.
  * `$vars.set(key, value)`: Set a variable in the `$vars` object. It will private to the item and not shared. If the key starts with `GLOBAL_`, the variable will be stored in the global scope and will be available for all items. This is useful to share data between items.
    * `$vars.get(key)`: Get a variable from the `$vars` object.
    * `$vars.get(key, fallback)`: Get a variable from the `$vars` object. If the variable is not set, return the fallback value. This is useful to avoid errors when the variable is not set.
  * `WebSSH_` vars: Contain some useful information about the current session. These are read-only ones and cannot be modified. The following properties are available:
    * `WebSSH_CONNECTION_NAME`: The name of the current session (eg. "My SSH Server")
    * `WebSSH_CONNECTION_HOST`: The host of the current session (eg. "ssh.example.com")
    * `WebSSH_CONNECTION_ADDRESS`: The resolved address of the current session (eg. "172.21.0.40")
    * `WebSSH_CONNECTION_SERVER_IDENTIFIER`: The SSH server identifier of the current session (eg. "SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.2")

### JavaScript Examples
#### Connectivity Indicator
This example shows how to create a connectivity indicator that will display a different icon depending on the connection status.
No need to write a label, as the icon will be enough to indicate the connection status.

```javascript
(function() {
    let icon = $ssh.isConnected() ? 'cable.connector' : 'cable.connector.slash'
    return {
        label: '',
        icon
    } 
})();
```

#### Display Remote Date
This example shows how to display the remote date in the State Bar.

```javascript
(function() {
    let date = ssh.exec('date')
    return {
        label: date,
        icon: 'calendar'
    } 
})();
```

#### Remote Server Resolved Address
This example shows how to display the resolved address of the remote server in the State Bar. As we don't return an Item Result Object, the label will be displayed by using the address and the icon will be the last one set.

```javascript
(function() {
    return $vars.get('WEBSSH_CONNECTION_ADDRESS');
})();
```

#### Display Used Disk Space on /
We will use the `df` command to get the used disk space on the root partition. As the command could hang, we will use the `timeout` command to limit the execution time to 1 second.

```javascript
(function() {
    return $ssh.exec("timeout -k 1s 1s df -h / | awk 'NR==2 {print $3}'")
})();
```

## State Bar Hub
The State Bar Hub is a collection of State Bar Items that are freely available to use : [statebarhub.webssh.net](https://statebarhub.webssh.net)

## Known Issues / Limitations
State Bar will be improved over months but, keep in mind that there are some limitations and known issues:

* When using `$ssh.exec`, try to avoid long running commands, as they will block the UI and the State Bar will not be updated until the command is finished. You should use as much as possible the [Linux `timeout`](https://www.man7.org/linux/man-pages/man1/timeout.1.html) command to limit the execution time of the command.
* "Connect Through" is not supported yet, so you can't use the State Bar when connected using this feature.
* When poor/no network, the State Bar and other UI elements may freeze. Disable the State Bar to avoid this issue.
* State Bar is updated every 3 seconds when NO user interaction is detected. Eg. when you are typing in the terminal, the State Bar will not be updated until you stop typing.