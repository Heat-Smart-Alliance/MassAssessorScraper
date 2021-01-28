#!/bin/bash

while [ "$( docker container inspect -f '{{.State.Running}}' $container_name )" == "true" ]
do
  print('Waiting for container to be up')
done
