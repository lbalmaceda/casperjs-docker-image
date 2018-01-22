#!/bin/bash

set -e

image=lbalmaceda/nodeqs
version=$1

echo Preparing to upload image to $image 
echo "==========================================================="
echo "==========================================================="
if [ -z "$version" ]; then
    echo "Specify a version name (i.e. 0.0.1)"
    exit 1
else
    docker build -t $image:$version .
    echo "==========================================================="
    echo "==========================================================="
    echo "Image created"
    echo "==========================================================="
    docker push $image:$version
    echo "==========================================================="
    echo "Image pushed to Docker hub. https://hub.docker.com/r/${image}/"
fi