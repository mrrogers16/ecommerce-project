#!/bin/bash

echo " Starting S3 Deployment..."

echo "#### Pulling latest changes from Git... ####"
git pull || { echo "xxx Error: Git pull failed xxx"; exit 1; }

# Path definitions
STAGING_DIR="/home/ubuntu/ecommerce-project/frontend/static_pages/"
S3_BUCKET="s3://ecommerce-static-0130"

# Sync files to S3
# As of now, the entire ecommerce-project directory is copied to the S3 bucket. May change to individual folders in the future.
echo "#### Syncing files to S3... ####"
aws s3 sync "$STAGING_DIR" "$S3_BUCKET" --delete || { echo "xxx Error: S3 sync failed xxx"; exit 1; }

echo "#### Deployment to S3 complete ####"

# Restart Nginx
echo "#### Restarting Nginx... ####"
sudo systemctl restart nginx || { echo "xxx Error: Nginx restart failed"; exit 1; };

# Restart Node.js server using PM2
echo "#### Restarting Node.js server... ####"
pm2 restart all || { echo "xxx Error: Node.js restart failed xxx"; exit 1; };

echo "######## Deployment Complete ########";


