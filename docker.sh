#!/bin/bash

cd admin && docker build -t sachin967/admin . && docker push sachin967/admin

cd ../messaging && docker build -t sachin967/messaging . && docker push sachin967/messaging

cd ../notification && docker build -t sachin967/notification . && docker push sachin967/notification

cd ../posts && docker build -t sachin967/posts . && docker push sachin967/posts

cd ../users && docker build -t sachin967/users . && docker push sachin967/users

cd ../frontend && docker build -t sachin967/frontend . && docker push sachin967/frontend