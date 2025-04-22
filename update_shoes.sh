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

echo "#### Syncing static pages to S3 ####"
aws s3 sync "$STAGING_DIR/static_pages" "$S3_BUCKET/static_pages" || { echo "xxxx Error syncing static_pages xxxx"; exit 1; }

echo "#### Syncing JS folder to S3 ####"
aws s3 sync "$STAGING_DIR/js" "$S3_BUCKET/js" --delete || { echo "xxxx Error syncing JS folder xxxx"; exit 1; }

echo "#### Syncing Routes folder to S3 ####"
aws s3 sync "$STAGING_DIR/../backend/routes" "$S3_BUCKET/routes" --delete || { echo "xxxx Error syncing JS folder xxxx"; exit 1; }

echo "#### Syncing CSS folder to S3 ####"
aws s3 sync "$STAGING_DIR/css" "$S3_BUCKET/css" --delete || { echo "xxxx Error syncing CSS folder xxxx"; exit 1; }

echo "#### Syncing Images folder to S3 ####"
aws s3 sync "$STAGING_DIR/assets/images" "$S3_BUCKET/assets/images" --delete || { echo "xxxx Error syncing Images folder xxxx"; exit 1; }

echo "#### Syncing Fonts folder to S3 ####"
aws s3 sync "$STAGING_DIR/fonts" "$S3_BUCKET/fonts" --delete || { echo "xxxx Error syncing Fonts folder xxxx"; exit 1; }


# CloudFront Cache Invalidation <------ This is why I almost threw my computer out of the window. smmfh
# In the future it would be nice to remove this and add versioning to all of our JS/CSS to abide by industry standards. 
echo "#### Creating CloudFront invalidation ####"

INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id E2DT7FJ3FS2XGY --paths "/*" | jq -r '.Invalidation.Id')

if [ -z "$INVALIDATION_ID" ]; then
    echo "xxxx Error: Failed to get CloudFront invalidation ID xxxx"
    exit 1
fi

echo ">>> CloudFront invalidation started: $INVALIDATION_ID"

# Wait for invalidation to complete
echo ">>> Waiting for CloudFront invalidation to complete..."

while true; do
    STATUS=$(aws cloudfront get-invalidation --distribution-id E2DT7FJ3FS2XGY --id $INVALIDATION_ID | jq -r '.Invalidation.Status')
    echo ">>> Current invalidation status: $STATUS"

    if [ "$STATUS" == "Completed" ]; then
        echo ">>> CloudFront invalidation completed!"
        break
    else
        sleep 5
    fi
done



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


