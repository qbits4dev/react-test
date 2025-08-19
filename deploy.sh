#!/bin/bash

# Exit on error
set -e

# Configuration
APP_NAME="react-test-app"
PORT=5000
HOST=0.0.0.0

# Fetch latest code
BRANCH="combined"
echo "Fetching latest code from branch: $BRANCH ..."
git pull origin "$BRANCH"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
npm run build

# Check if pm2 is installed, install if not
if ! command -v pm2 &> /dev/null
then
    echo "pm2 not found. Installing pm2 globally..."
    npm install -g pm2
fi

# Stop any existing pm2 process for this app
pm2 delete $APP_NAME || true

# Start the app with pm2, binding to 127.0.0.1:8100
# Serve the build directory using serve (install if needed)
if ! command -v serve &> /dev/null
then
    echo "serve not found. Installing serve globally..."
    npm install -g serve
fi


# Create logs directory if it doesn't exist
mkdir -p logs

echo "Starting the app on $HOST:$PORT..."
pm2 start serve \
    --name $APP_NAME \
    --output logs/${APP_NAME}-out.log \
    --error logs/${APP_NAME}-error.log \
    -- -s build -l $HOST:$PORT

echo "Deployment complete. App running at http://$HOST:$PORT"

# Show running process name(s)
echo "\nRunning process for $APP_NAME:"
pm2 list | grep "$APP_NAME" || echo "No running process found for $APP_NAME."
