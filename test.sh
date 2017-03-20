#!/bin/bash

PID_FILE="serve.prod.pid"

# Exit if any command fails
set -e

# Run the production server in the background and store its pid
exec 3< <(npm run serve.prod & echo $! > $PID_FILE)

# Wait for the server to be ready
while read line; do
    case "$line" in
        *Finished*serve.prod*)
            echo "$line"
            break
            ;;
        *)
            echo "$line"
            ;;
    esac
done <&3

# Execute the tests
npm run tests.all

# Terminate the production server
pkill -SIGINT -P $(cat $PID_FILE)

# Remove pid file
rm $PID_FILE

# Close the file descriptor where we were directing the output of the
# production server
exec 3<&-

# We exit with success because we have `set -e`
exit 0
