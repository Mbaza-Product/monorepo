FROM nginx:alpine
RUN apk update && apk add bash
RUN rm -rf /etc/localtime
RUN ln -s /usr/share/zoneinfo/Africa/Kigali /etc/localtime
COPY . /usr/share/nginx/html/


# Expose nginx default port 80
EXPOSE 80

# Start nginx daemon in container runtime
CMD ["nginx", "-g", "daemon off;"]