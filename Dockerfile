FROM node:lts-alpine as build

WORKDIR /app

COPY . .

RUN npm ci && npm run build

RUN --mount=type=secret,id=build_secrets \
  sed -i "s/<BACKEND_HOST>/$(cat /run/secrets/build_secrets)/g" lighttpd-prod.conf \
  && sed -i "s/<BACKEND_HOST>/$(cat /run/secrets/build_secrets)/g" lighttpd-test.conf

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