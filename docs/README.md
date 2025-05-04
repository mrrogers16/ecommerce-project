# Deployment Script update_shoes.sh

This Bash script automates the deployment process for your e - commerce project.It performs the following actions:

- Pulls the latest changes from the Git repository.
- Synchronizes the frontend static files to the AWS S3 bucket.
- Restarts Nginx to apply any new configuration or serve updated content.
- Verifies that Nginx is running.
- Restarts Node.js backend server using PM2.
- Performs quick HTTP check to confirm the server is responding with an acceptable status code.


# Usage 

Make Executable
chmod + x update_shoes.sh

# Run

    ./ update_shoes.sh

# To manage use pm2 [list|start/stop instancename]