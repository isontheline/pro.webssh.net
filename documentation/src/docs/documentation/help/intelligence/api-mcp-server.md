---
title: API / MCP Server
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
* ✅ Make Documentation Search

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
Make sure you have Docker Desktop installed on your Mac, then:

1. [Download latest WebSSH MCPB Extension here](https://github.com/webssh-software/webssh-mcpb-dxt-extension/releases)
2. Open the .mcpb file (Claude should launch if installed)
3. Review and adjust the settings (e.g., Port, Bearer Token)
4. Turn on the WebSSH Extension in Claude Desktop
5. The first time wait a minute to allow Docker to pull the container image needed
6. Now just ask Claude to perform actions using WebSSH!

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