FROM node:lts-alpine as build

ARG backend_host

RUN [[ "$backend_host" == "" ]] && echo "Missing or empty build arg: backend_host" && exit 1 || true

WORKDIR /app

COPY . .

RUN npm ci && npm run build \
&& sed -i "s/<BACKEND_HOST>/$backend_host/g" lighttpd-prod.conf \
&& sed -i "s/<BACKEND_HOST>/$backend_host/g" lighttpd-test.conf

FROM alpine:latest

ENV ENVIRONMENT=test

RUN set -ex \
&& addgroup --system --gid 1001 appgroup \
&& adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser \
&& apk update && apk upgrade && apk add --no-cache lighttpd \
&& rm -rf /var/cache/apk/*

COPY --from=build /app/lighttpd-*.conf /etc/lighttpd/

COPY --from=build /app/dist /var/www/html/

EXPOSE 8080

CMD lighttpd -D -f /etc/lighttpd/lighttpd-$ENVIRONMENT.conf

USER appuser