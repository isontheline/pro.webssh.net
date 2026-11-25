---
title: Workflows
seo_title: "Workflows: Automate SSH Tasks on iPhone, iPad and Mac - WebSSH"
description: "Build workflows from nodes in WebSSH: run commands on several servers, check certificates, call APIs, branch on the results. They run on your device, with your saved hosts and keys."
---
# Workflows
Since WebSSH 33.6 the **Workflows** section lets you chain actions as nodes on a canvas: run a command on a set of servers, read the result, branch on it, call an API, send yourself a notification.

A workflow runs **on your device**, with the hosts, keys and passwords WebSSH already knows. There is no server in between and nothing to install on your machines.

??? info "On this page"
    * [Create a workflow](#create-a-workflow), blank or from an example
    * [The editor](#the-editor) and [the nodes](#nodes)
    * [Data and references](#data-and-references): how a node uses what the previous one produced
    * [Where a node runs](#where-a-node-runs): hosts, groups, tags
    * [Run a workflow](#run-a-workflow) and the [ways to start one](#ways-to-start-a-workflow)
    * [Trust](#trust), [secrets](#secrets) and the [run history](#run-history)
    * [Versions](#versions): going back to an earlier state
    * [With an AI assistant](#with-an-ai-assistant): explain, change and run a workflow
    * [Import and export](#import-and-export)

## Create a workflow
1. Open the **Workflows** tile of the sidebar.
2. Use the add button (top right).
3. Choose **Blank workflow**, or one of the **examples**.

A blank workflow starts with a *Manual run* trigger. An example opens directly in the editor.

### Examples
The examples name no server: the nodes that run on hosts are flagged until you choose yours. Their titles and node names are in English in every language.

| Example | What it does |
| --- | --- |
| Fleet health | Uptime and disk usage of a set of servers, with a notification when the root disk goes over a limit |
| Certificates about to expire | Checks the TLS certificate of each domain of a list and tells which ones expire soon |
| Wake, then connect | Wake-on-LAN, a wait, a check of the SSH port, then a command |
| Restart a service safely | Restarts a systemd service, checks that it came back, shows its last log lines when it did not |
| What is this address? | From an IP address selected in a terminal: whois, reverse DNS and ping |
| Domain check | Addresses, e-mail setup, certificate and HTTPS port of a domain |
| Pending updates | Counts the packages waiting for an upgrade on each server (Debian, Ubuntu), the most behind first |
| Deploy a configuration file | Copies an nginx file from a reference server to others, tests it, reloads only where the test passes |
| New password for an account | Generates a password, sets it on a set of servers, copies a one-time link to hand it over |
| API health | Calls an endpoint with a token and tells whether it answers 200 |
| Status of the selected service | From a unit name selected in a terminal: its systemd status |
| Servers that need a reboot | Lists the servers where an update asked for a reboot (Debian, Ubuntu) |

??? note "Commands that need rights"
    The examples that restart a service or change a password use `sudo -n`: without a password-less sudo they fail at once with a readable error, they never wait for a password.

## The editor
A workflow reads **from top to bottom**: a node receives by its top, and sends by the outputs at its bottom.

* **Add a node**: tap the add icon of an output to add a node under it, already connected. The add button of the toolbar adds a node anywhere.
* **Connect**: drag from an output to another node. Dropping in the empty space opens the list of nodes.
* **Move**: drag a node. **Tidy Up** (floating button) lays the whole graph out again.
* **Settings of a node**: double tap (or double click) a node. They open beside the canvas on iPad and Mac, in a sheet on iPhone.
* **More**: long press (or right click) a node to duplicate, disable or delete it, and a link to insert a node on it or delete it.
* **Undo / Redo**: the toolbar button, ⌘Z and ⇧⌘Z on a keyboard.

The **⋯** menu of the editor offers **Show as List**: the same workflow as a list, which is also what VoiceOver users get by default. It also holds **Run history**, **Versions** and **Export**.

A warning sign on a node means that one of its settings is missing; the workflow cannot run until it is completed.

## Nodes
Every node has a **name** (used to refer to it), can be **disabled**, and says what happens **if it fails**:

* **Stop the run** (default)
* **Skip the item and go on**
* **Send the item out by Error**: the node gains an *Error* output, where the failing items go with the reason in their `error` field.

| Family | Nodes |
| --- | --- |
| Triggers | Manual run, Terminal selection |
| SSH | Run a command |
| Remote Files | Read a remote file, Write a remote file, List a remote folder |
| Tools | HTTP request, DNS lookup, Check a certificate, Check a port, Ping, Whois, Check e-mail setup, Calculate a subnet, Read a cron expression, Addresses of this device, Generate a password, Share a secret, Wake-on-LAN |
| Transform | Set fields, Parse (JSON, lines, CSV), Baker operation, Baker recipe |
| Code | JavaScript |
| Logic | If, Filter, Merge, Wait |
| Outputs | Result, Notification, Copy to clipboard |

The Tools nodes use the same engines as the [Sysadmin Tools](/documentation/tools/) of WebSSH. *Baker operation* applies one operation of the Baker Toolkit; *Baker recipe* applies a recipe you saved there, and follows it when you change it.

## Data and references
What travels along a link is a list of **items**. An item is a set of fields; a node that ran on a server also attaches that server to each item it produces.

* *Run a command* gives one item per host, with `text` (the output) and `exitCode`.
* *If* sends each item by **True** or by **False**; *Filter* keeps the items that match.
* A Tools node adds what the tool answered to the fields of the item (`status` for an HTTP request, `daysUntilExpiry` for a certificate, and so on).

In most settings you can refer to that data with double braces:

| Reference | Gives |
| --- | --- |
| `{{ $json.text }}` | A field of the incoming item |
| `{{ $json.data.id }}`, `{{ $json["a name"] }}` | A field inside a field; a name with spaces |
| `{{ $node["Disk usage"].json.text }}` | A field of what another node produced |
| `{{ $vars.SERVICE }}` | A value asked when the run starts |
| `{{ $host.name }}`, `{{ $host.address }}` | The server the item comes from |
| `{{ $trigger.text }}` | What started the run (the selected text, for instance) |

The **{}** button of a setting inserts a reference for you. After a first run it lists the fields the node really received.

Helpers: `optional(...)` gives nothing instead of an error when the field does not exist, `length(...)` counts, `json(...)` writes the value as JSON, `raw(...)` (see below).

??? warning "Values in a command are quoted"
    A value inserted in an SSH command is quoted for the shell, so that a file name with a space or a `;` cannot change the command. `raw(...)` lifts that protection: use it only for a value you wrote yourself.

A `{{` that is not followed by `$` is left alone: Docker and Jinja templates in your commands are not touched.

### JavaScript
The *JavaScript* node transforms items with a script. It runs either once with all the items (`items`, and `$hosts` for their servers), or once per item (`item`, `$host`). Return an object, a list of objects, or nothing.

The script only sees data: it has no network and no access to your servers. It is stopped after its timeout (10 seconds by default, 2 minutes at most). What it writes with `console.log` is shown with the run.

## Where a node runs
The nodes that work on servers have a **Run on** setting:

* **Chosen hosts**: saved hosts you pick one by one.
* **Group** or **Tag**: every saved host of that group or with that tag, read when the workflow runs.
* **Host of each item**: the server each incoming item comes from. Use it after a node that already ran on servers.
* **Session the run came from**: the saved host of the terminal the workflow was started from.

A workflow opens **its own connections**, a few servers at a time, and closes them when it ends: it never types in your open terminals. Jump hosts are followed. When a server asks for a password, a passphrase or a host key confirmation, the usual connection sheet is shown.

## Run a workflow
The **Run** button of the editor starts the workflow. When it has several triggers, or when its trigger asks for values, a sheet asks first.

On the canvas, the run is read on the nodes:

* each node shows whether it is running, succeeded (with the number of items it sent out), failed or was skipped;
* the links the data went through are coloured, so you can see which output of an *If* was taken;
* a bar at the bottom names the node being run and offers **Stop**, **Details**, and once the run is over **Run again**.

**Details** lists the nodes with what came in and went out of each. The **Results** are what the *Result* nodes produced, each under the name of its node; a long result is folded.

The settings of a node have a **Last run** tab: what that node received and produced the last time the workflow ran.

## Ways to start a workflow
* **Manual run**: the Run button. The trigger can declare values to ask at the start (`{{ $vars.NAME }}`), each with a default.
* **From the sidebar**: long press (or right click) a workflow in the library and choose **Pin to Sidebar**. A tap on the pinned tile runs it.
* **From a terminal selection**: add a *Terminal selection* trigger. Select some text in a terminal, right click and choose **Selection → Run a workflow**. The selected text is `{{ $trigger.text }}`.
* **From Shortcuts**: the **Run Workflow** action opens WebSSH and runs the workflow you chose. Combined with a personal automation, it is also the way to run a workflow at a set time.

??? note "Runs started by Shortcuts"
    A run started by Shortcuts never shows a connection sheet: a server that asks for a password fails its node at once, with a clear error. Use keys, or hosts whose password is saved.

## With an AI assistant
On the Mac, an AI assistant connected to WebSSH ([API / MCP Server](/documentation/help/intelligence/api-mcp-server/)) can work on your workflows, each kind of action with your approval:

* **read** a workflow and explain it: secrets are never included;
* **change** it: you are shown what changes, node by node and on the canvas, and the previous state stays in the [versions](#versions);
* **run** it and **read its runs**, to tell you why one failed.

The **✦** button of the editor, next to **⋯**, asks an assistant about the workflow on screen. An assistant never creates nor deletes a workflow.

## Trust
A workflow can run commands on your servers, so WebSSH keeps track of where it comes from, **per device**:

* a workflow you made or changed on a device is trusted on that device;
* a workflow that arrived through iCloud or from a file is not: its first run shows **Check before running**, the list of what it does outside its own data (the commands, the files, the hosts), and waits for your agreement.

## Secrets
Tokens and passwords used by a node (the token of an HTTP request, for instance) are stored in the **Keychain** of the device, never in the workflow. They are masked wherever a run is shown, and so are the passwords a workflow generates.

## Run history
**⋯ → Run history** (also in the menu of a workflow in the library) lists the last 20 runs of a workflow on this device, whatever started them: when, how they ended, how long they took. Open a run to see each node, with what came in and went out.

* The history stays **on the device**: it is never synchronized.
* **Keep the data of the runs** (on by default) can be turned off per workflow: a run then only keeps how it went.
* A run that is cut because the app stayed in the background too long, or was closed, is marked **Interrupted**. It is not resumed.

## Versions
WebSSH keeps the earlier states of a workflow, so that a change can still be taken back once the editor is closed. **⋯ → Versions** in the editor lists them, newest first, with what each one changed.

* A version is kept **by itself**: when you leave the editor after a change, and before each run.
* Tap a version to see it on the canvas. Nothing can be changed there; the settings of a node open to be read.
* **Restore** asks for a confirmation, then puts it back. The workflow as it was is kept as a version too, so a restore can be undone.
* In the **run history**, a run shows **Workflow as it ran** while that version is kept.
* A change made by an [AI assistant](/documentation/help/intelligence/api-mcp-server/) leaves two versions: the workflow before it, and the workflow as the assistant left it, under its name.

The last 20 versions of each workflow are kept **on the device**: they are never synchronized. Moving nodes around does not make a new version.

??? note "Secrets and trust"
    A secret that was removed since a version was kept does not come back with it: set it again. A version that was never checked on this device asks before its first run, as the workflow did.

## Import and export
**Export** (menu of a workflow in the library, or ⋯ in the editor) saves a workflow as a `.wsworkflow` file, which is readable JSON. **Import** is in the ⋯ menu of the library; a `.wsworkflow` file can also be opened with WebSSH from Files or the Finder.

* A file **never contains a secret**: set them again after an import.
* An imported workflow is **not trusted**: it asks before its first run.
* Hosts chosen one by one are specific to the device that exported the file; on another device, choose them again. Groups and tags work when they have the same names.

Workflows are also synchronized through [iCloud](/documentation/help/iCloud/) like your other WebSSH data.

??? note "Free version"
    Without WebSSH PRO you keep full use of **one workflow of up to 10 nodes** (triggers count). Beyond that, for instance after an import, a workflow can be viewed and deleted; adding a node or running it opens the PRO upgrade. The nodes of the Tools family are not counted against the limits of the tools they use. [WebSSH PRO](/documentation/pricing/) removes the limits.

## Limits
* An item holds up to 256 KB of fields and 5 MB of bytes; an output passes on up to 1,000 items.
* A command is stopped after its timeout (60 seconds by default).
* *Wait* goes up to one hour: a run is not a scheduler.
