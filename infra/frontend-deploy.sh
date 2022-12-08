#!/bin/sh

IS_BLUE=$(docker ps | grep frontend-blue) # 현재 실행중인 App이 blue인지 확인

DEFAULT_CONF="./nginx/default.conf"

docker-compose up -d nginx

if [ $IS_BLUE  ];then # blue라면
        echo "### BLUE => GREEN ###"
        echo "1. get green image"
        docker-compose pull frontend-green # 이미지 받아서
        echo "2. green container up"
        docker-compose up -d frontend-green # 컨테이너 실행
        while [ 1 = 1 ]; do
                echo "3. green health check..."
                sleep 3
                REQUEST=$(docker exec nginx curl http://frontend-green:8080) # green으로 request
                if [ -n "$REQUEST" ]; then # 서비스 가능하면 break
                        echo "health check success"
                        break ;
                fi
        done;
        sed -i 's/frontend-blue/frontend-green/g' $DEFAULT_CONF # nginxrk green을 가리키도록 변경
        echo "4. reload nginx"
        docker exec nginx service nginx reload
        echo "5. blue container down"
        docker-compose stop frontend-blue
else
        echo "### GREEN => BLUE ###"
        echo "1. get blue image"
        docker-compose pull frontend-blue
        echo "2. blue container up"
        docker-compose up -d frontend-blue
        while [ 1 = 1 ]; do
                sleep 3
                echo "3. blue health check..."
                REQUEST=$(docker exec nginx curl http://frontend-blue:8080)
                if [ -n "$REQUEST" ]; then
                if [ -n "$REQUEST" ]; then
                                echo "health check success"
                                break ;
                fi
        done;
        sed -i 's/frontend-green/frontend-blue/g' $DEFAULT_CONF
        echo "4. reload nginx"
        docker exec nginx service nginx reload
        echo "5. green container down"
        docker-compose stop frontend-green
fi
