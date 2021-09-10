#!/bin/sh +x
# sudo docker-compose logs blockchain | grep -A14 "Available Accounts"

helpFunction()
{
    echo ""
    echo "Usage: $0 [option]"
    echo "OPTIONS"
    echo "\t status - checks if the blockchain is up or down"
    echo "\t info - Lists the blockchain information"
    echo "\t start - Starts the blockchain service"
    echo "\t stop - Stops the blockchain service"
    echo "\t reset - Resets the blockchain"
    exit 1
}

exists() {
    OUT=$(sudo docker-compose ps)
    if echo "$OUT" | grep -q "blockchain"
    then
        return 0
    fi
    return 1
}

case $1 in
    status)
        if exists; then
            echo "Up"
        else
            echo "Down"
        fi
        exit 0
        ;;
    info)
        if ! exists
        then
            echo "blockchain container not running. Execute './blockchain start' first'"
            exit 1
        fi
        sudo docker-compose logs blockchain | grep -A14 "Available Accounts"
        ;;
    start)
        sudo docker-compose up -d blockchain
        ;;
    stop)
        sudo docker-compose stop blockchain
        ;;
    reset)
        if ! exists
        then
            echo "blockchain container not running. Execute './blockchain start' first'"
            exit 1
        fi
        sudo docker-compose stop blockchain
        yes | sudo docker-compose rm blockchain
        sudo rm -rf blockchain/data
        sudo docker-compose up -d blockchain
        ;;
    *)
        helpFunction
        ;;
esac
echo "Done."