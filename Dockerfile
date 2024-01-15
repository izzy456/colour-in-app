FROM node:lts-alpine as build

ARG backend_host backend_port=8080

RUN [[ "$backend_host" == "" ]] && echo "Missing or empty build arg: backend_host" && exit 1 || true

WORKDIR /app

COPY . .

RUN npm ci && npm run build \
&& sed -i "s/<BACKEND_HOST>/$backend_host/g" lighttpd.conf \
&& sed -i "s/<BACKEND_PORT>/$backend_port/g" lighttpd.conf

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