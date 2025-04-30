ARG VITE_BACKEND_URI

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
RUN mkdir -p /root/.aspnet/https
RUN dotnet dev-certs https --trust --export-path /root/.aspnet/https/renovationapp.client.pem --format Pem -p certPassword
RUN echo "certPassword" > /root/.aspnet/https/renovationapp.client.key
RUN echo 'Made certs'


FROM node:18-alpine AS buildstage2
ENV VITE_BACKEND_URI=$VITE_BACKEND_URI
COPY --from=build /root/.aspnet/https/renovationapp.client.pem /root/.aspnet/https/
COPY --from=build /root/.aspnet/https/renovationapp.client.key /root/.aspnet/https/
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo $VITE_BACKEND_URI
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=buildstage2 /app/dist /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]