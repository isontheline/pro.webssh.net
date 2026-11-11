---
title: API / MCP Server
seo_title: "SSH MCP Server & API for macOS - WebSSH"
description: "WebSSH for macOS includes a built-in API / MCP (Model Context Protocol) server: AI applications like Claude Desktop and your own scripts can drive SSH sessions."
---

# API / MCP Server

Since version `30.7`, WebSSH introduces a built-in **API / MCP (Model Context Protocol) server**, enabling external applications to interact with WebSSH programmatically.

This opens up a range of possibilities for integration—including with AI applications such as Claude Desktop. By using the API, these tools can automate tasks, retrieve data, or incorporate WebSSH’s capabilities into more complex workflows.

This feature is only available on macOS.

## Example Use Cases

- **AI Applications (e.g., Claude Desktop):**  
  Automate SSH sessions, manage terminals, or extract data for analysis within the app.

- **Custom Integrations:**  
  Connect your own scripts or automation tools directly to WebSSH’s functionality.

- **Data Retrieval and Management:**  
  Programmatically fetch server status, logs, or outputs for use in dashboards or other applications.

## Available Features
* ✅ Retrieve Terminal Content
* ✅ Send Commands to Terminal
* ✅ Run a command in the background on an open SSH session (output and exit status, nothing typed in the terminal)
* ✅ Capture the terminal as an image (PNG or JPEG)
* ✅ List directories, read text files and download files on the server of an open SSH session (SCP over the existing connection)
* ✅ Write, upload (from ~/Downloads), create, move, chmod and delete files on that server, each with your approval
* ✅ Retrieve your IP Addresses
* ✅ Make DNS Lookup
* ✅ Make Whois Requests
* ✅ Subnet calculator (IPv4 / IPv6)
* ✅ Cron expression explainer with the next run dates
* ✅ TLS certificate check (trust, expiry, chain)
* 🚧 Make Ping Requests
* 🚧 Launch Traceroute

## Usage Instructions
### Enabling the API / MCP Server
1. Open WebSSH on your Mac
2. Navigate to **WebSSH** menu > **Settings**
3. Locate the **API / MCP** settings panel
4. Toggle "Feature Availability" to **Enabled**
5. Close the settings window
6. Go to **Inventory** > **Tools**
7. Toggle the **API / MCP Server** switch to **ON**

### Using Claude Desktop as a MCP Client
Claude Desktop only talks to local MCP servers through **stdio**: it refuses `localhost` URLs in its Connectors settings, whatever the scheme, because custom connectors are reached from Anthropic's servers. Since version `33.3`, WebSSH therefore ships a tiny bridge inside the app bundle, `WebSSH.app/Contents/MacOS/webssh-mcp`, which relays Claude's requests to the API / MCP server running in WebSSH. WebSSH writes the port and the token for it: nothing to install, nothing to copy by hand.

**One-click setup**

1. In WebSSH, go to **Inventory** > **Tools**, right-click (or long-press) **API / MCP** and choose **Claude** > **Install into Claude Desktop…**
2. A file panel opens on Claude's folder (`~/Library/Application Support/Claude`): click **Open**. WebSSH adds its `webssh` entry (bridge path, port and token) to `claude_desktop_config.json`, keeping everything else in the file and a copy of the previous version next to it (`claude_desktop_config.json.webssh-backup`). Run it again whenever you change the port or the token
3. Quit and relaunch Claude Desktop

**Manual setup**

1. In WebSSH, right-click **API / MCP** and choose **Claude** > **Copy Claude Desktop Configuration**
2. In Claude Desktop, open **Settings** > **Developer** > **Edit Config** (this opens `claude_desktop_config.json`)
3. Paste the copied fragment, merging the `webssh` entry into an existing `mcpServers` object if you already have one:

```json
{
  "mcpServers": {
    "webssh": {
      "command": "/Applications/WebSSH.app/Contents/MacOS/webssh-mcp",
      "env": {
        "WEBSSH_MCP_TOKEN": "YOUR_BEARER_TOKEN_HERE",
        "WEBSSH_MCP_PORT": "1985"
      }
    }
  }
}
```

4. Quit and relaunch Claude Desktop
5. Make sure the **API / MCP** switch is **ON** in WebSSH, then ask Claude to use WebSSH!

You do not even need WebSSH to be running when Claude starts: the tools are listed right away, and the first time Claude uses one, WebSSH is launched in the background and its server started (the installer also sets **Start Strategy** to *Launch when WebSSH starts*). If WebSSH cannot start, Claude receives a clear message telling you what to check.

The **Claude** submenu only appears when a Claude application is detected on your Mac (Claude Desktop or Claude Code).

> The former **WebSSH MCPB extension** (`webssh-mcpb-dxt-extension`, which required Docker Desktop) is deprecated: the built-in bridge replaces it. You can remove the extension from Claude Desktop.

### Permissions
Every action an assistant takes on your sessions belongs to a family, and each family has one answer: **Allow**, **Ask** (the default for all of them) or **Deny**. Ask shows a sheet in WebSSH with who is asking, which session and what is about to happen, where you can also allow the rest of that session. Defaults live in **Settings** > **API / MCP** and on the **AI Assistants** screen, under **Permissions**, next to the open sessions where you answered "Always for this session" (forget one from its context menu, or reset them all).

- **Terminal commands**: typed into the visible terminal, as if you had typed them.
- **Background commands**: run on a separate channel of the session you already opened, nothing appears in the terminal, and the assistant gets the output and the exit status. WebSSH never opens a connection for it, and refuses it on mosh, Telnet and jump-host sessions. Outputs above 16 KB are written to `~/Downloads/WebSSH/<session>/` and the assistant receives the path and a preview.
- **Reading the terminal**: the screen as text, or as a screenshot. **Once you let a command through in a tab, reading that tab is allowed for the rest of the session**, since seeing the result is the natural next step; a read with no command before it still asks. When you deny a read, the assistant still gets the session's name and state, with a note saying the screen was not shared. Listing your open sessions (names and identifiers only) never asks.
- **Reading files**: listing a directory, reading a text file or downloading a file on the server of an open SSH session, over that session (SCP on the existing connection, nothing new is opened). Small text files come back to the assistant directly; larger ones and downloads land in `~/Downloads/WebSSH/<session>/`, never overwriting an existing file.
- **Writing files**: write a text file the assistant composed, upload a file from your `~/Downloads` folder (the one local folder WebSSH can read), create a folder, rename or move, chmod.
- **Deleting files**: files and folders; a non-empty folder needs an explicit recursive request, and the sheet shows the command in red. WebSSH refuses to delete `/` or your home itself.

Every one of these actions is listed in the session's journal (**History** > **Assistants**), and commands leave a marker in the session recording.

### Ask an assistant from a session
On the Mac, when an assistant app is installed, a ✦ button sits in the terminal bar next to Snippets. It asks what you want (explain the screen, summarize the last output, why the last command failed, suggest a command…), lets you pick the app (Claude chat, Claude Code, Codex or Cursor; the ones connected right now are marked), and opens it with your question and the session's identity in the composer. Nothing is sent until you press Enter there, and the assistant reads the session through WebSSH.

### The AI Assistants screen
Open **Inventory** > **Tools** > **AI Assistants** (or tap the **API / MCP** card). The screen shows whether the server runs and which assistant is connected, lets you connect each client, and lists prompts to try: tap one to copy it, or open it straight in Claude Desktop (chat or Claude Code), Codex or Cursor, where it lands in the composer for you to send. Every client goes through the `webssh-mcp` bridge: it starts WebSSH when needed and carries the token for you.

- **Claude Desktop**: one click, as above.
- **Claude Code**: copy the command and run it in a terminal, e.g. `claude mcp add --transport stdio webssh --env WEBSSH_MCP_TOKEN=… --env WEBSSH_MCP_PORT=1985 -- /Applications/WebSSH.app/Contents/MacOS/webssh-mcp`.
- **Codex** (CLI, IDE extension and the Codex app share the configuration): `codex mcp add webssh --env WEBSSH_MCP_TOKEN=… --env WEBSSH_MCP_PORT=1985 -- /Applications/WebSSH.app/Contents/MacOS/webssh-mcp`. The Codex app bundled in ChatGPT does not put `codex` on your PATH: the command WebSSH copies then points at the bundled CLI, or use **Copy configuration** and paste the block into `~/.codex/config.toml`.
- **Cursor** and **VS Code**: an **Install** link, or **Copy configuration** to paste into the editor's MCP settings.

Scripts and clients without stdio can still use the HTTP endpoint directly, see below.

### Seeing what the assistant does
- The **API / MCP** card shows the connected assistant and the last command it sent.
- Each connected assistant has its own tile in the sidebar, with its last action. The badge tells its state: a moon on grey while it has asked nothing yet or for a minute, sparkles on green when it is active, an orange question mark while a request waits for your approval, a red hand when its last request was refused, an orange triangle when it failed.
- Click the tile, or the assistant's row in **AI Assistants**, to list everything that connection did, newest first; an action made in a terminal opens that session's journal. Right-click the tile to open **AI Assistants**.
- In the terminal, the **Assistant** item of the state bar lights up for a few seconds with the command.
- The terminal's **…** menu (and a tap on the ✦ witness) opens the **Session journal**: the recording of that session when there is one, then everything the assistants did in it.
- **Inventory** > **History** > **Assistants** keeps one card per terminal session touched by an assistant (commands, screens read, lookups), with the History retention. These events never sync to iCloud, like the recordings. A card opens its Session journal.
- When a session is being recorded, each assistant command leaves a marker in the recording: for a full audit, turn recording on (**AI Assistants** > bottom of the screen > **Recording settings**).
- **Settings** > **API / MCP** > **Assistant commands**: choose **Ask before running a command** to approve each command in a sheet (Deny, Allow, Always for this session). Off by default.

### Network access
By default the server listens on `127.0.0.1` only: it can be reached from this Mac and nothing else. To let another device on your local network connect (with the Bearer token), set **Listen on** to **Any device on the local network** in **WebSSH** > **Settings** > **API / MCP**, then switch the server off and on again.

### WebSSH OpenAPI Specification
Once the API / MCP server is enabled, you can access the OpenAPI specification by navigating to:
`http://localhost:1985/openapi.json`

This JSON file describes all available endpoints, request/response formats, and authentication methods for interacting with the WebSSH API. You can use this specification to generate client libraries or documentation for your specific use case.

### WebSSH MCP Server
With the API / MCP server enabled, you can access the MCP endpoints at:
`http://localhost:1985/mcp`

You can use any external application which supports MCP protocol to connect to WebSSH and interact with its features programmatically.

To play and debug MCP requests, you can use the awesome Context app : https://github.com/indragiek/Context

### Authentication
Authentication is handled via a Bearer Token, which can be found in the **API / MCP** settings panel within WebSSH.

When making requests to the API, include the following HTTP header:

```Authorization: Bearer YOUR_BEARER_TOKEN_HERE```