#!/bin/bash

FILE_DIR=$(dirname "$0")
# go to script directory!
cd ${FILE_DIR}
FULL_PATH=$(pwd)
APP_PATH="${FULL_PATH}"

MATCH_STR="****** /GIT-CP ALIAS @ https://github.com/mitzerh/node-git-batch-cherry-pick ******"
MATCH_EOD_STR="****** EOF /GIT-CP ******"
GIT_CP_CMD="git cherry-pick --strategy=recursive -X theirs"

# aliases
GIT_ALIAS_CP="gitcp"
GIT_ALIAS_BATCHCP="batchcp"

# if this dude does not have a bash profile, create one..
if [ ! -f ~/.bash_profile ]; then

    cat > ~/.bash_profile <<EOF
#!/bin/bash

# ${MATCH_STR}

alias ${GIT_ALIAS_CP}=${APP_PATH}/app.js

function batchcgitcp_fn {

    if [ "\$1" != "" ]; then
        while IFS=',' read -ra LIST; do
            for HASH in "\${LIST[@]}"; do
                ${GIT_CP_CMD} \${HASH}
            done
        done <<< "\$1"
    fi

}

alias ${GIT_ALIAS_BATCHCP}=batchcgitcp_fn

# ${MATCH_EOD_STR}

EOF

# executable
chmod +x ~/.bash_profile
# reload bash_profile
source ~/.bash_profile

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

alias ${GIT_ALIAS_CP}=${APP_PATH}/app.js

function batchcgitcp_fn {
    if [ "\$1" != "" ]; then
        while IFS=',' read -ra LIST; do
            for HASH in "\${LIST[@]}"; do
                ${GIT_CP_CMD} \${HASH}
            done
        done <<< "\$1"
    fi
}

alias ${GIT_ALIAS_BATCHCP}=batchcgitcp_fn

# ${MATCH_EOD_STR}

EOF
    
    else

        echo "already set.."

    fi

fi

source ~/.bash_profile

echo "done!"
echo "Check examples to run the script @ https://github.com/mitzerh/node-git-batch-cherry-pick"