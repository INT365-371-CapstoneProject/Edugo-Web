# Stage 1: Build React app
FROM node:19 AS stage1
COPY . /nodeproj/
WORKDIR /nodeproj/
RUN npm install
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy build output from Stage 1 to nginx server
COPY --from=stage1 /nodeproj/dist/ /usr/share/nginx/html/

# Copy custom nginx config
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
