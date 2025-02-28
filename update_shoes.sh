#!/bin/bash

echo " Starting S3 Deployment..."

echo "#### Pulling latest changes from Git... ####"
git pull || { echo "xxxx Error: Git pull failed xxxx"; exit 1; }

# Path definitions
STAGING_DIR="/home/ubuntu/ecommerce-project/frontend/static_pages/"
S3_BUCKET="s3://ecommerce-static-0130"

# Sync files to S3
# As of now, the entire ecommerce-project directory is copied to the S3 bucket. May change to individual folders in the future.
echo "#### Syncing files to S3... ####"
aws s3 sync "$STAGING_DIR" "$S3_BUCKET" --delete || { echo "xxxx Error: S3 sync failed xxxx"; exit 1; }

echo "#### Deployment to S3 complete ####"

# Restart Nginx
echo "#### Restarting Nginx... ####"
sudo systemctl restart nginx || { echo "xxxx Error: Nginx restart failed"; exit 1; };

# Verify Nginx is active
echo "#### Checking Nginx status... ####"
if systemctl is-active --quiet nginx
then
    echo ">>> Nginx is running"
else
    echo "xxxx Error: Nginx is not running xxxx"
    exit 1
fi 

# Restart Node.js server using PM2
echo "#### Restarting Node.js server... ####"
pm2 restart all || { echo "xxxx Error: Node.js restart failed xxxx"; exit 1; };


# Quick HTTP check to verify server response
# Adjust the URL to match your actual server (localhost or domain)
echo "#### Verifying server is responding on localhost ####"
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L http://ec2-3-144-13-97.us-east-2.compute.amazonaws.com)

if [ "$HTTP_RESPONSE" -eq 200 ]
then
    echo ">>> Server is up and responding with HTTP 200 OK."
else
    echo "xxx Error: Server is not responding with HTTP 200 xxx"
    exit 1
fi

echo "######## Deployment Complete ########";


