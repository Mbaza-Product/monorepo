#!/bin/sh

sed -i 's&https://dev.mbaza.digital&https://test.mbaza.digital&g' ./src/Chatroom.js 
sed -i 's&dev.mbaza.digital&test.mbaza.digital&g' index.html 
sed -i 's&dev.mbaza.digital&test.mbaza.digital&g' ./kinyarwanda/index.html 

echo 
echo "-------------------------------"
echo
cat ./src/Chatroom.js | grep https

echo 
echo "-------------------------------"
echo
cat index.html | grep mbaza
echo 
echo "-------------------------------"
echo
cat ./kinyarwanda/index.html | grep mbaza
echo 
echo "-------------------------------"
echo