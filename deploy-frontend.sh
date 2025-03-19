#!/bin/bash

# Simplified frontend deployment script for YouAreWe
# This script only deploys the frontend component

# Exit on any error
set -e

# Configuration
PROD_SERVER="170.64.231.250"
SSH_USER="root"  # Replace with your SSH username
FRONTEND_DEPLOY_PATH="/var/www/html"  # Replace with your frontend deployment path

# Build the frontend
echo "Building the frontend..."
yarn workspace @YouAreWe/frontend build

# Deploy Frontend
echo "Deploying frontend to $PROD_SERVER..."

# Create a tarball of the frontend build
echo "Creating frontend tarball..."
tar -czf frontend-build.tar.gz -C packages/frontend/build .

# Copy the tarball to the server
echo "Copying frontend build to server..."
scp frontend-build.tar.gz $SSH_USER@$PROD_SERVER:/tmp/

# Extract the tarball on the server and clean up
echo "Extracting frontend build on server..."
ssh $SSH_USER@$PROD_SERVER "
  # Backup the current deployment
  if [ -d $FRONTEND_DEPLOY_PATH ]; then
    timestamp=\$(date +%Y%m%d%H%M%S)
    mkdir -p /tmp/backups
    tar -czf /tmp/backups/frontend-\$timestamp.tar.gz -C $FRONTEND_DEPLOY_PATH .
  fi
  
  # Clear the deployment directory
  mkdir -p $FRONTEND_DEPLOY_PATH
  rm -rf $FRONTEND_DEPLOY_PATH/*
  
  # Extract the new build
  tar -xzf /tmp/frontend-build.tar.gz -C $FRONTEND_DEPLOY_PATH
  
  # Clean up
  rm /tmp/frontend-build.tar.gz
  
  # Set permissions
  chmod -R 755 $FRONTEND_DEPLOY_PATH
  
  # Restart frontend server (if using a server like nginx)
  systemctl restart nginx 2>/dev/null || true
"

# Clean up local tarball
rm frontend-build.tar.gz

echo "Frontend deployment complete!"