#!/bin/bash

# Deployment script for YouAreWe
# Usage: ./deploy.sh [options]
# Options:
#   --frontend-only: Deploy only the frontend
#   --backend-only: Deploy only the backend
#   --help: Display this help message

# Exit on any error
set -e

# Configuration
PROD_SERVER="170.64.231.250"
SSH_USER="root"  # Replace with your SSH username
FRONTEND_DEPLOY_PATH="/var/www/html"  # Replace with your frontend deployment path
BACKEND_DEPLOY_PATH="/root/YouAreWe/packages/backend"  # Replace with your backend deployment path

# Parse arguments
DEPLOY_FRONTEND=true
DEPLOY_BACKEND=true

for arg in "$@"; do
  case $arg in
    --frontend-only)
      DEPLOY_BACKEND=false
      shift
      ;;
    --backend-only)
      DEPLOY_FRONTEND=false
      shift
      ;;
    --help)
      echo "Deployment script for YouAreWe"
      echo "Usage: ./deploy.sh [options]"
      echo "Options:"
      echo "  --frontend-only: Deploy only the frontend"
      echo "  --backend-only: Deploy only the backend"
      echo "  --help: Display this help message"
      exit 0
      ;;
    *)
      # Unknown option
      ;;
  esac
done

# Build the application
echo "Building the application..."
yarn build

# Deploy Frontend
if [ "$DEPLOY_FRONTEND" = true ]; then
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
  "
  
  # Clean up local tarball
  rm frontend-build.tar.gz
  
  echo "Frontend deployment complete!"
fi

# Deploy Backend
if [ "$DEPLOY_BACKEND" = true ]; then
  echo "Deploying backend to $PROD_SERVER..."
  
  # Create a tarball of the backend build
  echo "Creating backend tarball..."
  tar -czf backend-build.tar.gz -C packages/backend/dist .
  
  # Copy the tarball to the server
  echo "Copying backend build to server..."
  scp backend-build.tar.gz $SSH_USER@$PROD_SERVER:/tmp/
  
  # Extract the tarball on the server and restart the service
  echo "Extracting backend build on server and restarting service..."
  ssh $SSH_USER@$PROD_SERVER "
    # Backup the current deployment
    if [ -d $BACKEND_DEPLOY_PATH/dist ]; then
      timestamp=\$(date +%Y%m%d%H%M%S)
      mkdir -p /tmp/backups
      tar -czf /tmp/backups/backend-\$timestamp.tar.gz -C $BACKEND_DEPLOY_PATH/dist .
    fi
    
    # Stop the current backend
    pm2 stop YouAreWe-backend 2>/dev/null || true
    
    # Clear the deployment directory
    mkdir -p $BACKEND_DEPLOY_PATH/dist
    rm -rf $BACKEND_DEPLOY_PATH/dist/*
    
    # Extract the new build
    tar -xzf /tmp/backend-build.tar.gz -C $BACKEND_DEPLOY_PATH/dist
    
    # Clean up
    rm /tmp/backend-build.tar.gz
    
    # Start the backend
    cd $BACKEND_DEPLOY_PATH && NODE_ENV=production pm2 start --name YouAreWe-backend npm -- run start
  "
  
  # Clean up local tarball
  rm backend-build.tar.gz
  
  echo "Backend deployment complete!"
fi

echo "Deployment completed successfully!"