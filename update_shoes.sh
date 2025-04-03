#!/bin/bash
echo "#### Starting ecommerce-project deployment ####"
echo "#### Starting S3 Deployment... ####"

echo "#### Pulling latest changes from Git... ####"
git pull || { echo "xxxx Error: Git pull failed xxxx"; exit 1; }

# Path definitions
STAGING_DIR="/home/ubuntu/ecommerce-project/frontend"
S3_BUCKET="s3://ecommerce-static-0130"



# Sync files to S3
##### ADD NEW PAGES AND THINGS LIKE THAT HERE
##### Think of $S3_BUCKET/ and STAGING_DIR as the frontend project root folder. All directories and files branch off of it.

echo "#### Syncing index.html to S3 root ####"
aws s3 cp "$STAGING_DIR/index.html" "$S3_BUCKET/index.html" || { echo "xxxx Error syncing index.html xxxx"; exit 1; }

echo "#### Syncing Static HTML Pages to Bucket Root ####"
aws s3 sync "$STAGING_DIR/static_pages" "$S3_BUCKET" --delete --exclude "*.DS_Store" || { echo "xxxx Error syncing static pages xxxx"; exit 1; }

echo "#### Syncing JS folder to S3 ####"
aws s3 sync "$STAGING_DIR/js" "$S3_BUCKET/js" --delete || { echo "xxxx Error syncing JS folder xxxx"; exit 1; }

echo "#### Syncing Routes folder to S3 ####"
aws s3 sync "$STAGING_DIR/../backend/routes" "$S3_BUCKET/routes" --delete || { echo "xxxx Error syncing JS folder xxxx"; exit 1; }

echo "#### Syncing CSS folder to S3 ####"
aws s3 sync "$STAGING_DIR/css" "$S3_BUCKET/css" --delete || { echo "xxxx Error syncing CSS folder xxxx"; exit 1; }

echo "#### Syncing Images folder to S3 ####"
aws s3 sync "$STAGING_DIR/images" "$S3_BUCKET/images" --delete || { echo "xxxx Error syncing Images folder xxxx"; exit 1; }

echo "#### Syncing Fonts folder to S3 ####"
aws s3 sync "$STAGING_DIR/fonts" "$S3_BUCKET/fonts" --delete || { echo "xxxx Error syncing Fonts folder xxxx"; exit 1; }

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

if [ "$HTTP_RESPONSE" -eq 200 ] || [ "$HTTP_RESPONSE" -eq 301 ] || [ "$HTTP_RESPONSE" -eq 302 ]
then
    echo ">>> Server returned a healthy status: $HTTP_RESPONSE"
else
    echo "xxx Error: Unexpected HTTP status: $HTTP_RESPONSE xxx"
    exit 1
fi

echo "######## Deployment Complete ########";


