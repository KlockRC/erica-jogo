# erica-jogo
teste
sistema de contas
conecxao com o mongo
profissoes
deixar bonitinho


foi criado 2 containeres da api - front e back

front: noname120hz/api-front-end:1.0.0
back: noname120hz/api-back-end:1.0.0

para colocar a aplicação no ar se precisa de 4 comandos:

docker run -d --name db --rm mongo
DBIP=$(docker inspect db | grep -w IPAddress | head -n 1 | cut -d'"' -f3)
docker run -d --rm --name back -e MONGO_IP=$DBIP -p 3000:3000 noname120hz/api-back-end:1.0.0
docker run -d --rm --name front -p 8080:80 noname120hz/api-front-end:1.0.0
