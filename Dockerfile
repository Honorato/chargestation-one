FROM node:20-alpine AS build
WORKDIR /app

COPY . .
RUN yarn install --ignore-scripts
RUN yarn run build

FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
