port=8080

echo "port number [default: $port]:"
read -t 10 userPort

if echo $userPort$1 | grep -vsq "^[0-9]*$"; then
	echo
	echo "invalid port number. Using default instead"
	userPort=""
fi

port=${userPort:-$port}

echo "port: " $port

http-server -p $port