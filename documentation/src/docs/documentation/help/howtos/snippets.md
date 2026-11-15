---
title: Snippets
description: "Snippets are reusable commands or scripts you can insert into your SSH terminal. How to create and use them in WebSSH."
---

# Snippets

??? abstract "What is a Snippet?"
    A Snippet is a reusable piece of command/script that you can insert into your connection terminal. It can be useful for frequently used commands or configurations.

## How to add a snippet?
There are two ways to add a snippet in WebSSH:

1. **From the Snippets Section**:
    - Navigate to the "Snippets" section in the WebSSH application
    - Click on the "+" top right button
    - Fill in the details such as the snippet name, icon and the command/script you want to save
    - Save the snippet using the top right button ☑️
2. **From a Connection**:
    - Launch an existing connection or create a new one (and launch it)
    - Tap the `< />` top button on the navigation bar
    - Click on the "+" top right button
    - Fill in the details such as the snippet name, icon and the command/script you want to save
    - Save the snippet using the top right button ☑️

## How to use a snippet?
To use a snippet in your connection terminal:

1. Launch the desired connection
2. Tap the `< />` top button on the navigation bar
3. Select the snippet you want to insert from the list
4. The command/script from the snippet will be inserted into your terminal, ready to be executed — or run immediately when **Execute on tap** is enabled (see below)

## Groups
Once you have more than a handful of snippets, arrange them in groups so you no longer scroll through the whole list to find one.

- **Put a snippet in a group**: edit the snippet and fill in **Group Name**, or pick an existing group from the button next to the field. You can also long-press (right-click on Mac) a snippet and choose **Move to Group**.
- **Show a group**: as soon as one group exists, a row of chips appears under the search field, in the Snippets list and in the snippet picker of your terminal. Tap a chip to see only the snippets of that group, tap **All** to see everything. Your last choice is remembered.
- **Move several snippets at once**: from the `•••` menu choose **Select**, select the snippets, then use the group button of the navigation bar.
- **Rename or remove a group**: long-press (right-click on Mac) its chip. Removing a group never deletes snippets: they simply no longer belong to a group.

Good to know:

- A snippet belongs to one group at most, and there are no sub-groups.
- Group names are not case sensitive: typing `docker` joins an existing `Docker` group.
- A group exists as long as one snippet uses it.
- Groups only arrange the list. To make a snippet available on some connections only, use [tags](link-connections-using-tags.md).
- On Mac, the terminal right-click menu shows one submenu per group, and the sidebar lists your groups under the Snippets tile.
- A snippet imported from the WebSSH Library lands in the group of its category (Docker, Network…). Move it wherever you like.
- Groups follow your snippets through iCloud sync and backups.

## Keyboard shortcuts
Since WebSSH 33.1 a snippet can be run with a keyboard shortcut, on macOS and on iPad with a hardware keyboard. Nine shortcuts are available: `⌥⌘1` to `⌥⌘9`.

To assign one, edit the snippet and pick a shortcut in the **Keyboard Shortcut** row, then save. Assigning a shortcut is a WebSSH PRO feature.

- The snippet runs in the active terminal, which must be connected.
- A snippet restricted by [tags](link-connections-using-tags.md) only runs on the connections it matches.
- Picking a shortcut already used by another snippet moves it to the snippet you are editing.
- On macOS, the snippets holding a shortcut are listed in the menu bar, under **Connection ▸ Snippets**.

??? note "⌥⌘8 and the macOS Zoom"
    macOS reserves `⌥⌘8` for its accessibility Zoom when "Use keyboard shortcuts to zoom" is enabled in System Settings. In that case the shortcut never reaches WebSSH: pick another one.

## Execute on tap
Since WebSSH 33.2 a snippet can run as soon as it is inserted, with no extra tap on Enter: edit the snippet, turn on **Execute on tap**, then save. WebSSH sends Enter right after the command, using the *Carriage Return* character of the connection's profile. Snippets that run on tap wear a ⏎ badge in the list.

- The switch is **off by default**: a snippet that runs by itself must be opted into.
- It also applies to [keyboard shortcuts](#keyboard-shortcuts), to the **Snippets** context menu on macOS and to [dynamic variables](#dynamic-variables) (Enter follows the command once the form is validated).
- A command whose text already ends with a line break runs on tap too, as it always did: WebSSH never sends Enter twice, so the switch is harmless on such a snippet. The ⏎ badge is shown in both cases.
- [Run on Hosts](run-snippet-on-multiple-hosts.md) is not affected: it executes the command directly, without a terminal.

## Import snippets from a GitHub Gist
Since WebSSH 32.7 the **•••** menu of the Snippets screen offers **Import from Gist…**: the files of a public gist become snippets, and a snippet can later be refreshed from its source. The same menu opens the **WebSSH Library**, a curated collection of ready-made snippets. See [Import Snippets from GitHub Gist](import-snippets-from-github-gist.md).

## Run a snippet on several hosts
Since WebSSH 33.0 a snippet can be run on several connections at once, without opening a terminal: long press the snippet and choose **Run on Hosts**. See [Run a command on multiple hosts](run-snippet-on-multiple-hosts.md).

## Dynamic variables
A snippet can ask for values when it runs. Write a placeholder between triple braces and WebSSH shows a small form before sending the command:

```bash
echo "You are {{{ NAME : Awesome }}}!"
```

| Syntax | Behaviour |
| --- | --- |
| `{{{ NAME }}}` | Free text, empty by default |
| `{{{ NAME : default }}}` | Free text, prefilled with `default` (edge spaces are trimmed) |
| `{{{ NAME : " default " }}}` | Quotes keep the spaces and protect `:` and `|` inside the default |
| `{{{ NAME : first : second : third }}}` | A choice list, `first` selected |
| `{{{ NAME : default | secret }}}` | The value is typed in a secure field and hidden in the preview |

Rules:

- A name uses letters, digits and underscores, must not start with a digit and is case-sensitive (`{{{ Path }}}` and `{{{ PATH }}}` are two variables).
- The same name used several times is asked once; its first occurrence defines the default, the choices and the modifiers.
- A placeholder that does not follow the syntax is left as-is in the command, so you can see what went wrong.
- Values are inserted exactly as typed: WebSSH adds no shell quoting, and a value is never interpreted as a [key token](SSH/adding-control-key-to-snippets.md) such as `<ctrl-c>` nor as another placeholder.
- Nothing is remembered between runs: every execution starts from the defaults.

### Built-in variables
These names are prefilled from the current connection. They stay editable in the form.

| Name | Value |
| --- | --- |
| `{{{ HOST }}}` | Hostname or IP address of the connection |
| `{{{ USER }}}` | Username of the connection |
| `{{{ PORT }}}` | Port of the connection |
| `{{{ CONNECTION }}}` | Name of the connection |
| `{{{ DATE }}}` | Today, as `YYYY-MM-DD` |

### Examples
```bash
ssh -p {{{ PORT }}} {{{ USER }}}@{{{ HOST }}}
tar czf backup-{{{ DATE }}}.tgz {{{ DIR : /var/www }}}
tail -n {{{ LINES : 100 }}} -f {{{ LOG : /var/log/syslog : /var/log/auth.log : /var/log/nginx/error.log }}}
mysql -u {{{ DB_USER : root }}} -p{{{ DB_PASSWORD | secret }}} {{{ DATABASE }}}
```