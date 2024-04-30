# !bin/bash
# jys01012@gmail.com

# Check if database ready
MAX_TRY=8
CURRENT_TRY=0

# Wrapper
function check_status {
    echo -e "\033[34m"
    bash -c "./wait-for-it.sh -s -t 60 $1"
    echo "\033[0m"
    if [ $? ==  0 ]; then
        echo -e "\033[32m ...Success\033[0m";
        #sleep 1
    else
        echo -e "\033[31m >> ...Failed\033[0m";
        exit -1;
    fi
}

echo -e "\033[34m#### Check DB READY ####:: ${NODE_ENV}\033[0m";

echo -e "\033[32mUsing NODE_ENV :: ${NODE_ENV}\033[0m";
echo -e "\033[32mUsing Dodkcer :: ${USE_NODE_DOCKER}\033[0m";

if [ $NODE_ENV == "local" ]; then
    echo -e "Using .env.local"
    if [ -f ".env.local" ]; then
        export $(cat .env.local | sed 's/#.*//g' | xargs) # env file load
    else
        echo -e "\033[31m[FATAL] There is no .env.local !! - Abort\033[0m";
        exit -1
    fi
elif [ $NODE_ENV == "development" ]; then
    echo -e "Using .env.development"
    if [ -f ".env.development" ]; then
        export $(cat .env.development | sed 's/#.*//g' | xargs) # env file load
    else
        echo -e "\033[31m[FATAL] There is no .env.development !! - Abort\033[0m";
        exit -1
    fi
elif [ $NODE_ENV == "production" ]; then
    echo -e "Using .env.production"
    if [ -f ".env.production" ]; then
        export $(cat .env.production | sed 's/#.*//g' | xargs) # env file load
    else
        echo -e "\033[31m[FATAL] There is no .env.production !! - Abort\033[0m";
        exit -1
    fi
else
    echo -e "\033[31m[FATAL] None of NODE_ENV found - Abort\033[0m";
    exit -1
fi

echo -e "\033[32mSuccessfully load enviroment variables\033[0m";

# POSTGRE ping test
until echo '\q' | docker exec "${DB_CONTAINER_NAME}" pg_isready -h "${DB_PURE_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_DATABASE}"> /dev/null 2>&1; do
    if [ $CURRENT_TRY -eq $MAX_TRY ]; then
        echo -e "\033[31mPOSTGRE is unavailable - Abort\033[0m";
        exit -1;
    else
        >&2 echo -e "\033[33mPOSTGRE is unavailable - sleeping 5sec\033[0m";
    sleep 5
    fi
    
    CURRENT_TRY=$((CURRENT_TRY+1))
done

echo -e "\033[32mPOSTGRE is ready\033[0m";

# # Mysql ping test
# until echo '\q' | docker exec $DB_CONTAINER_NAME mysql -h "${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" ${DB_DATABASE}> /dev/null 2>&1; do
#     if [ $CURRENT_TRY -eq $MAX_TRY ]; then
#         echo -e "\033[31mMYSQL is unavailable - Abort\033[0m";
#         exit -1;
#     else
#         >&2 echo -e "\033[33mMySQL is unavailable - sleeping 5sec\033[0m";
#     sleep 5
#     fi
    
#     CURRENT_TRY=$((CURRENT_TRY+1))
# done
# echo -e "\033[32mMYSQL is ready\033[0m";