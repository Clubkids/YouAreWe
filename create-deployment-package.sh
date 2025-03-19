#!/bin/bash

# Create deployment package script
# This script creates a deployment package that can be manually uploaded

# Exit on any error
set -e

# Clean previous builds if present
rm -rf deployment-package 2>/dev/null || true
rm frontend-deployment.tar.gz 2>/dev/null || true

# Build the frontend
echo "Building the frontend..."
yarn workspace @YouAreWe/frontend build

# Create deployment package
echo "Creating deployment package..."
mkdir -p deployment-package

# Copy frontend build
echo "Copying frontend build..."
cp -r packages/frontend/build/* deployment-package/

# Create an installation script
echo "Creating installation instructions..."
cat > deployment-package/INSTALL.txt << 'EOL'
DEPLOYMENT INSTRUCTIONS
======================

This package contains the built frontend for YouAreWe.

To deploy:

1. Upload all files in this package to your web server root directory 
   (typically /var/www/html or similar)

2. Make sure your web server (Nginx, Apache, etc.) is configured to serve 
   these static files and handle client-side routing.

3. For Nginx, here's a sample configuration:

   server {
     listen 80;
     server_name your_domain.com;
     root /var/www/html;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }

4. After deploying, restart your web server:
   sudo systemctl restart nginx
   (or for Apache: sudo systemctl restart apache2)

5. The application should now be accessible at your domain or IP address.
EOL

# Create a tarball of the deployment package
echo "Creating tarball..."
tar -czf frontend-deployment.tar.gz -C deployment-package .

# Clean up
rm -rf deployment-package

echo "Deployment package created: frontend-deployment.tar.gz"
echo "Upload this file to your server and extract it to your web root directory."
echo "See the included INSTALL.txt file for further instructions."