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
* ✅ Retrieve your IP Addresses
* ✅ Make DNS Lookup
* ✅ Make Whois Requests
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
Claude Desktop only talks to local MCP servers through **stdio**: it refuses `localhost` URLs in its Connectors settings, whatever the scheme, because custom connectors are reached from Anthropic's servers. Since version `33.3`, WebSSH therefore ships a tiny bridge inside the app bundle, `WebSSH.app/Contents/MacOS/webssh-mcp`, which relays Claude's requests to the API / MCP server running in WebSSH. It finds the port and the token by itself: nothing to copy, nothing to install.

1. In WebSSH, go to **Inventory** > **Tools**, right-click (or long-press) **API / MCP** and choose **Copy Claude Desktop Configuration**
2. In Claude Desktop, open **Settings** > **Developer** > **Edit Config** (this opens `claude_desktop_config.json`)
3. Paste the copied fragment, merging the `webssh` entry into an existing `mcpServers` object if you already have one:

```json
{
  "mcpServers": {
    "webssh": {
      "command": "/Applications/WebSSH.app/Contents/MacOS/webssh-mcp"
    }
  }
}
```

4. Quit and relaunch Claude Desktop
5. Make sure the **API / MCP** switch is **ON** in WebSSH, then ask Claude to use WebSSH!

If WebSSH is not running or the server is switched off, Claude receives a clear error telling you what to open.

> The former **WebSSH MCPB extension** (`webssh-mcpb-dxt-extension`, which required Docker Desktop) is deprecated: the built-in bridge replaces it. You can remove the extension from Claude Desktop.

### Using Claude Code, Cursor, VS Code or Codex
These clients connect to a local HTTP MCP server directly. In WebSSH, right-click **API / MCP** and choose **Copy Claude Code Command** to get a ready-to-run command such as:

```claude mcp add --transport http webssh http://127.0.0.1:1985/mcp --header "Authorization: Bearer YOUR_BEARER_TOKEN_HERE"```

For other clients, use the URL `http://127.0.0.1:1985/mcp` (Streamable HTTP) with the `Authorization: Bearer …` header described below.

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