# Use the official Apache HTTP server image
FROM httpd:2.4

# Copy your local HTML/website files into the container's hosting directory
COPY . /usr/local/apache2/htdocs/

# Inform Docker that the container listens on port 80
EXPOSE 80