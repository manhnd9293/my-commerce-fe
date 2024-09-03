FROM node:lts as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build:staging

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/config/default.conf /etc/nginx/conf.d/default.conf

