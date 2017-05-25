#!/bin/sh

BASEDIR=$(dirname "$0")
cd ${BASEDIR} && BASEDIR=`pwd`
TEMPLATE_STATIC_DIR=$BASEDIR/themes/viisix/static
TEMP_DIR=${BASEDIR}/tmp

if [ ! -d "$TEMP_DIR" ]; then
    mkdir ${TEMP_DIR}
fi

# BASSCSS
FILE_NAME=basscss.min.css
OLD_FILE=${TEMPLATE_STATIC_DIR}/css/${FILE_NAME}
NEW_FILE=${TEMPLATE_STATIC_DIR}/css/n.${FILE_NAME}
curl -Ls https://unpkg.com/basscss/css/basscss.min.css > ${NEW_FILE}
if [ -f ${OLD_FILE} ]; then
    OLD_FILE_CHECKSUM=`md5 ${OLD_FILE} | awk '{ print $4 }'`
else
    OLD_FILE_CHECKSUM=''
fi
NEW_FILE_CHECKSUM=`md5 ${NEW_FILE} | awk '{ print $4 }'`
if [ "$OLD_FILE_CHECKSUM" != "$NEW_FILE_CHECKSUM" ]; then
    echo "Updating ${FILE_NAME}"
    mv ${NEW_FILE} ${OLD_FILE}
else
    rm ${NEW_FILE}
fi

# vue.js
FILE_NAME=vue.js
OLD_FILE=${TEMPLATE_STATIC_DIR}/js/${FILE_NAME}
NEW_FILE=${TEMPLATE_STATIC_DIR}/js/n.${FILE_NAME}
curl -Ls https://vuejs.org/js/vue.js > ${NEW_FILE}
if [ -f ${OLD_FILE} ]; then
    OLD_FILE_CHECKSUM=`md5 ${OLD_FILE} | awk '{ print $4 }'`
else
    OLD_FILE_CHECKSUM=''
fi
NEW_FILE_CHECKSUM=`md5 ${NEW_FILE} | awk '{ print $4 }'`
if [ "$OLD_FILE_CHECKSUM" != "$NEW_FILE_CHECKSUM" ]; then
    echo "Updating ${FILE_NAME}"
    mv ${NEW_FILE} ${OLD_FILE}
else
    rm ${NEW_FILE}
fi

# vue.min.js
FILE_NAME=vue.min.js
OLD_FILE=${TEMPLATE_STATIC_DIR}/js/${FILE_NAME}
NEW_FILE=${TEMPLATE_STATIC_DIR}/js/n.${FILE_NAME}
curl -Ls https://vuejs.org/js/vue.min.js > ${NEW_FILE}
if [ -f ${OLD_FILE} ]; then
    OLD_FILE_CHECKSUM=`md5 ${OLD_FILE} | awk '{ print $4 }'`
else
    OLD_FILE_CHECKSUM=''
fi
NEW_FILE_CHECKSUM=`md5 ${NEW_FILE} | awk '{ print $4 }'`
if [ "$OLD_FILE_CHECKSUM" != "$NEW_FILE_CHECKSUM" ]; then
    echo "Updating ${FILE_NAME}"
    mv ${NEW_FILE} ${OLD_FILE}
else
    rm ${NEW_FILE}
fi

# JQUERY -- Check manually

# Google Code Prettify
cd ${TEMP_DIR}
DOWNLOAD_FILE_NAME=prettify-small.zip
UPGRADING=0
curl -Ls https://github.com/google/code-prettify/raw/master/distrib/prettify-small.zip > ${DOWNLOAD_FILE_NAME}
if [ ! -f "$BASEDIR/google_prettify_checksum" ]; then
    echo `md5 ${DOWNLOAD_FILE_NAME} | awk '{ print $4 }'` > ${BASEDIR}/google_prettify_checksum
    UPGRADING=1
else
    OLD_FILE_CHECKSUM=`cat ${BASEDIR}/google_prettify_checksum`
    NEW_FILE_CHECKSUM=`md5 ${DOWNLOAD_FILE_NAME} | awk '{ print $4 }'`
    if [ "$OLD_FILE_CHECKSUM" != "$NEW_FILE_CHECKSUM" ]; then
        UPGRADING=1
        echo ${NEW_FILE_CHECKSUM} > ${BASEDIR}/google_prettify_checksum
    fi
fi
if [ "$UPGRADING" == "1" ]; then
    echo "Upgrading Google Code Prettify"
    FILE_NAME=code-prettify
    cd ${TEMPLATE_STATIC_DIR}
    rm -rf ${FILE_NAME}
    unzip ${TEMP_DIR}/${DOWNLOAD_FILE_NAME}
    mv google-code-prettify ${FILE_NAME}
    cd ${FILE_NAME}/skins
    curl -Ls https://jmblog.github.io/color-themes-for-google-code-prettify/themes/atelier-dune-light.min.css \
        > atelier-dune-light.min.css
fi

# Clean up
cd ${BASEDIR} && rm -rf ${TEMP_DIR}
