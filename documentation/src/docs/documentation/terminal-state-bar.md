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
* **Icon**: The icon of the item, displayed in the State Bar
* **JavaScript**: The JavaScript code that will be executed to get the value of the item. The result of this code will be displayed in the State Bar.

## JavaScript Code
In order to build your item content, you need to write a small piece of JavaScript code. This code should return a Scalar (String, Integer, etc.) or even better an Item Result Object (see below) that will be displayed in the State Bar.

If you return an undefined value or a null value, the item will be hidden in the State Bar.

### Item Result Object
The Item Result Object is an object that contains the following properties:

* **label**: The text value of the item, this is the value that will be displayed in the State Bar. Fallback to empty string if not defined.
* **icon**: The icon of the item, this icon will be displayed in the State Bar. This property is optional. Refer to SF Symbols for the list of available icons. If not provided, the last icon set will be used.

### Exposed variables and functions
The JavascriptCode is running inside a sandbox, so you can't access the DOM or any other global variables. You can only use the following variables and functions:
* `ssh.exec`: The SSH object used to execute commands on the remote server. You can use it to execute any command you want. Will return a String
* `ssh.isConnected`: A boolean that indicates if the SSH connection is established or not. Useful to display a message when the connection is lost.

## Known Issues / Limitations
State Bar will be improved over months but, keep in mind that there are some limitations and known issues:

* When using `ssh.exec`, try to avoid long running commands, as they will block the UI and the State Bar will not be updated until the command is finished.
* "Connect Through" is not supported yet, so you can't use the State Bar when connected using this feature.
* When poor/no network, the State Bar and other UI elements may freeze. Disable the State Bar to avoid this issue.
* State Bar is updated every 3 seconds when no user interaction is detected.