---
title: Snippets
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
4. The command/script from the snippet will be inserted into your terminal, ready to be executed

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