FROM nginx:alpine
RUN apk update && apk add bash
RUN rm -rf /etc/localtime
RUN ln -s /usr/share/zoneinfo/Africa/Kigali /etc/localtime
COPY ./static /usr/share/nginx/html/static
COPY ./dist /usr/share/nginx/html/dist
COPY index.html /usr/share/nginx/html
COPY index.css /usr/share/nginx/html

COPY  ./kinyarwanda /usr/share/nginx/html/kinyarwanda
COPY ./dist /usr/share/nginx/html/kinyarwanda/dist
COPY ./static /usr/share/nginx/html/kinyarwanda/static
COPY index.css /usr/share/nginx/html/kinyarwanda
