FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy our static files
COPY index.html /usr/share/nginx/html/index.html
COPY script.js /usr/share/nginx/html/script.js

EXPOSE 80