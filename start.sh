#!/bin/sh

# Copy SSL certificates
cp ./ssl/WwyxRB/chain.pem /etc/nginx/ssl/chain.pem
cp ./ssl/WwyxRB/privkey.pem /etc/nginx/ssl/privkey.pem
cp ./ssl/WwyxRB/fullchain.pem /etc/nginx/ssl/fullchain.pem

if [ ! -f /etc/nginx/ssl/chain.pem ] || [ ! -f /etc/nginx/ssl/privkey.pem ] || [ ! -f /etc/nginx/ssl/fullchain.pem ]; then
    echo "Error: SSL certificate files not copied correctly"
    exit 1
fi

# Set proper permissions for SSL certificates
chmod 600 /etc/nginx/ssl/privkey.pem
chmod 644 /etc/nginx/ssl/chain.pem
chmod 644 /etc/nginx/ssl/fullchain.pem


# Start Node.js application in background
node dist/main.js &

# Start nginx in foreground
nginx -g 'daemon off;'