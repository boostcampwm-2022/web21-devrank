#!/bin/sh

IS_BLUE=$(docker ps | grep backend-blue) # 현재 실행중인 App이 blue

DEFAULT_CONF="./nginx/default.conf"

docker-compose up -d nginx
docker-compose up -d redis

if [ $IS_BLUE  ];then # blue라면
        echo "### BLUE => GREEN ###"
        echo "1. get green image"
        docker-compose pull backend-green # 이미지 받아서
        echo "2. green container up"
        docker-compose up -d backend-green # 컨테이너 실행
        while [ 1 = 1 ]; do
                echo "3. green health check..."
                sleep 3
                REQUEST=$(docker exec nginx curl http://backend-green:3001) # green으로 request
                if [ -n "$REQUEST" ]; then # 서비스 가능하면 break
                        echo "health check success"
                        break;
                fi
        done;
        sed -i 's/backend-blue/backend-green/g' $DEFAULT_CONF # nginxrk green을 가리키도록 변경
        echo "4. reload nginx"
        docker exec nginx service nginx reload
        echo "5. blue container down"
        docker-compose stop backend-blue
else
        echo "### GREEN => BLUE ###"
        echo "1. get blue image"
        docker-compose pull backend-blue
        echo "2. blue container up"
        docker-compose up -d backend-blue
        while [ 1 = 1 ]; do
                sleep 3
                echo "3. blue health check..."
                REQUEST=$(docker exec nginx curl http://backend-blue:3001)
                if [ -n "$REQUEST" ]; then
                        echo "health check success"
                        break;
                fi
        done;
        sed -i 's/backend-green/backend-blue/g' $DEFAULT_CONF
        echo "4. reload nginx"
        docker exec nginx service nginx reload
        echo "5. green container down"
        docker-compose stop backend-green
fi
