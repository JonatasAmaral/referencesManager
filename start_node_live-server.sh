port=8080

echo "port number [default: 8080]:"
read -t 10 userPort

if echo $userPort$1 | grep -vsq "^[0-9]*$"; then
	echo
	echo "invalid port number. Using default instead"
	userPort=""
fi

port=${userPort:-$port}

echo "Serving $pwd at http://" ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'

live-server --port=$port
