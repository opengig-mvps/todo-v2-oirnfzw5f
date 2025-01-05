#!/bin/bash

# Install project dependencies
npm install

# Create necessary directories
# mkdir -p /home/node/.vscode-server/data/User/globalStorage/saoudrizwan.claude-dev/settings
mkdir -p /home/node/.vscode-remote/data/User/globalStorage/saoudrizwan.claude-dev/settings

# Setup user-stories server
if [ -d "/workspaces/todo-v2-oirnfzw5f/user-stories-server" ]; then
    # Build the project
    cd /workspaces/todo-v2-oirnfzw5f/user-stories-server
    npm install
    npm run build
    
    # Start the server in a new terminal
    mkdir -p /workspaces/todo-v2-oirnfzw5f/.vscode
    cat > /workspaces/todo-v2-oirnfzw5f/.vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start User Stories Server",
      "type": "shell",
      "command": "cd /workspaces/todo-v2-oirnfzw5f/user-stories-server && node build/index.js",
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^.*$",
          "file": 1,
          "location": 2,
          "message": 3
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "^.*Server starting.*$",
          "endsPattern": "^.*Server started.*$"
        }
      },
      "presentation": {
        "reveal": "always",
        "panel": "new",
        "group": "servers"
      }
    }
  ]
}
EOF

    # Create MCP settings file
    cat > /home/node/.vscode-remote/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json <<EOF
{
  "mcpServers": {
    "user-stories": {
      "command": "node",
      "args": ["/workspaces/todo-v2-oirnfzw5f/user-stories-server/build/index.js"],
      "env": {
        "API_KEY": "ldbrkfioyfsxvxuf"
      }
    }
  }
}
EOF

    # Set proper permissions
    chmod 644 /home/node/.vscode-remote/data/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
    
    # Start the server automatically
    nohup node /workspaces/todo-v2-oirnfzw5fr/user-stories-server/build/index.js
    
    echo "User Stories server started. Check logs at /home/codespace/user-stories.log"
fi