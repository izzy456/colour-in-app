FROM node:lts-alpine as build

ARG environment=test

WORKDIR /app

COPY . .

RUN --mount=type=secret,id=build_secrets \
  [[ "$environment" == "prod" ]] \
  && sed "s|<BACKEND_HOST>|$(cat /run/secrets/build_secrets)|g" lighttpd-prod.conf > lighttpd.conf \
  && sed -i "s|<BACKEND_PATH>||g" src/getColourIn.js \
  || (sed "s|<BACKEND_HOST>|$(cat /run/secrets/build_secrets)|g" lighttpd-test.conf > lighttpd.conf \
  && sed -i "s|<BACKEND_PATH>|/experimental|g" src/getColourIn.js)

RUN npm ci && npm run build && \
  [[ "$environment" != "prod" ]] \
  && sed -i "s|/assets/|/experimental/assets/|g" dist/index.html \
  || true

FROM alpine:latest

RUN set -ex \
&& addgroup --system --gid 1001 appgroup \
&& adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser \
&& apk update && apk upgrade && apk add --no-cache lighttpd \
&& rm -rf /var/cache/apk/*

COPY --from=build /app/lighttpd.conf /etc/lighttpd/

COPY --from=build /app/dist /var/www/html/

EXPOSE 8080

CMD lighttpd -D -f /etc/lighttpd/lighttpd.conf

USER appuser