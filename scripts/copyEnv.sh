#!/bin/bash

REF_NAME=$1
CONFIG=$2

case $REF_NAME in
  "master")
    ENV_FILE=$CONFIG/.env.dev
  ;;
  "staging")
    ENV_FILE=$CONFIG/.env.stg
  ;;
  "release")
    ENV_FILE=$CONFIG/.env.prd
  ;;
  *)
    echo "Invalid REF_NAME"
    exit 1
  ;;
esac

echo "Copying $ENV_FILE to .env"
cp $ENV_FILE .env