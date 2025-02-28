#!/bin/bash

echo " Starting S3 Deployment..."

echo "Pulling latest changes from Git..."
git pull || { echo "Error: Git pull failed"; exit 1; }

# Path definitions
STAGING_DIR="/home/ubuntu/ecommerce-project/"
S3_BUCKET="s3://ecommerce-static-0130"

# Sync files to S3
echo "Syncing files to S3..."
aws s3 sync "$STAGING_DIR" "$S3_BUCKET" --delete --acl public-read || { echo "Error: S3 sync failed"; exit 1; }

echo "Deployment to S3 complete"
