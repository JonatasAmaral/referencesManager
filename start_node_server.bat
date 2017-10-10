@echo off
set userPort=8080

echo "port number [default: %userPort%]:"

set /p userPort=""

set /a port=userPort

if %port% == %userPort% (
	rem set /a port=userPort
) ELSE (
	echo "invalid port number. Using default instead"
    set port=8080
)
rem set /p adress=<adress.txt

http-server -p %port% -o