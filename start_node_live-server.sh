port=8080

echo "port number [default: $port]:"
read -t 10 userPort

if echo $userPort$1 | grep -vsq "^[0-9]*$"; then
	echo
	echo "invalid port number. Using default instead"
	userPort=""
fi

port=${userPort:-$port}

# show local ip adress
# echo "Serving $(pwd) at http://", ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'
localIp=$(ipconfig | grep "IPv4" | grep -Eo "192.168.[0-9]{1,3}.[0-9]{1,3}")
echo "Serving $(pwd) at http://", ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' || echo "Serving $(pwd) at http://$localIp:$port"

live-server --port=$port
