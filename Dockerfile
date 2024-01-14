FROM node:lts-alpine as build

ARG backend_url

ENV VITE_GET_COLOUR_IN_URL $backend_url

WORKDIR /app

COPY . .

RUN npm ci && npm run build

FROM alpine:latest

RUN set -ex \
&& addgroup --system --gid 1001 appgroup \
&& adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser \
&& apk update && apk upgrade && apk add --no-cache lighttpd \
&& rm -rf /var/cache/apk/*

COPY --from=build /app/lighttpd.conf /etc/lighttpd/

COPY --from=build /app/dist /var/www/html/

EXPOSE 8080

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]

USER appuser