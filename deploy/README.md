# Despliegue de Habitta

La demo se ejecuta en `/opt/apps/habitta` con Docker Compose. La aplicación
usa la red privada `deploy_habitta-internal`; Caddy es el único componente
publicado en los puertos 80 y 443.

## Actualización

Antes de actualizar, registrar el SHA de `main` y conservar la imagen activa:

```bash
cd /opt/apps/habitta
docker tag deploy-habitta-web:latest deploy-habitta-web:previous
docker compose -f deploy/docker-compose.production.yml build habitta-web
docker compose -f deploy/docker-compose.production.yml up -d habitta-web
```

Validar el health check y los endpoints públicos antes de retirar la imagen
anterior.

## Rollback de aplicación

Si la nueva imagen falla, restaurar la imagen anterior sin tocar MariaDB:

```bash
cd /opt/apps/habitta
docker tag deploy-habitta-web:previous deploy-habitta-web:latest
docker compose -f deploy/docker-compose.production.yml up -d habitta-web
docker inspect --format '{{.State.Health.Status}}' deploy-habitta-web-1
```

## Base de datos

No se debe eliminar `habitta_db_data` en una actualización normal. Antes de
cambios de esquema, crear un dump usando las credenciales root guardadas en
`/opt/secrets/habitta-db.env` y conservarlo fuera del contenedor. La cuenta
`habitta_app` está limitada a `SELECT` y `EXECUTE`.

El seed `scripts/seed-realistic-demo.mjs` es destructivo y no forma parte del
procedimiento de despliegue.
