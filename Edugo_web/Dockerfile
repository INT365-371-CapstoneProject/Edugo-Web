FROM node:aplpine3.18 as build


# Build app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 5173
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
