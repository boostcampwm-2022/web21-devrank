#!/bin/sh

DEFAULT_CONF="./nginx/default.conf"

sed -i 's/green/blue/g' $DEFAULT_CONF

docker-compose up -d redis

echo "1. backend - get blue image"
docker-compose pull backend-blue

echo "2. backend - blue container up"
docker-compose up -d backend-blue

docker-compose stop backend-green


echo "3. frontend - get blue image"
docker-compose pull frontend-blue

echo "4. frontend - blue container up"
docker-compose up -d frontend-blue

echo "5. start nginx"
docker-compose up -d nginx


while [ 1 = 1 ]; do
        sleep 3
        echo "6. backend - blue health check..."
        REQUEST=$(docker exec nginx curl http://backend-blue:3001)
        if [ -n "$REQUEST" ]; then
                echo "health check success"
                break;
        fi
done;


while [ 1 = 1 ]; do
        sleep 3
        echo "7. frontend - blue health check..."
        REQUEST=$(docker exec nginx curl http://frontend-blue:8080)
        if [ -n "$REQUEST" ]; then
                echo "health check success"
                break;
        fi
done;
