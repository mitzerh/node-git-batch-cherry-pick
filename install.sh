#!/bin/bash

FILE_DIR=$(dirname "$0")
# go to script directory!
cd ${FILE_DIR}
FULL_PATH=$(pwd)
APP_PATH="${FULL_PATH}"

MATCH_STR="GIT-CP ALIAS"

# if this dude does not have a bash profile, create one..
if [ ! -f ~/.bash_profile ]; then

    cat > ~/.bash_profile <<EOF

# ${MATCH_STR}
alias gitcp=${APP_PATH}/app.js

EOF

else

    INSTALLED="no"

    while IFS='' read -r LINE_STR || [[ -n "$LINE_STR" ]]; do

        if [ "${LINE_STR/$MATCH_STR}" != "${LINE_STR}" ]; then
            INSTALLED="yes"
            break;
        fi

    done < ~/.bash_profile

    if [ "${INSTALLED}" = "no" ]; then

        cat >> ~/.bash_profile <<EOF

# ${MATCH_STR}
alias gitcp=${APP_PATH}/app.js

EOF
    
    else

        echo "already set.."

    fi

fi

source ~/.bash_profile

echo "done."