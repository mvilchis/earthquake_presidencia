#! /bin/bash
MAPSAPIURL="http://maps.googleapis.com/maps/api/geocode/json"

curl -XGET 'https://docs.google.com/spreadsheets/d/1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC5VU/export?format=csv&id=1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC5VU&gid=0' -o raw_data.csv
echo "" >>raw_data.csv
echo 'var edificios = {
"type": "FeatureCollection",
"features": [' > tmp.geojson
tail --lines=+2 raw_data.csv | while read line; do\
                              lat=`echo $line|awk -v FS="," '{print $1}'`;
                              lon=`echo $line|awk -v FS="," '{print $2}'`;
                              status=`echo $line|awk -v FS="," '{print $3}'`;
                              name=`echo $line|awk -v FS="," '{print $4}'`;
                              type=`echo $line|awk -v FS="," '{print $5}'`;
                              more_info=`echo $line|awk -v FS="," '{print $6}'|tr "\n" " "`;
                              #Ask by address
                              curl -G -s --data sensor=true --data-urlencode latlng=$lat,$lon "$MAPSAPIURL" -o result.json
                              address=`jq '.results[]|.formatted_address' result.json | head -n1 | sed "s/\"//g"`
                              #rm result.json
                              echo '{ "type": "Feature", "properties": { "ADDRESS": "'$address\
                              '", "STATUS":'$status', "NAME": "'$name'","MORE_INFO":"'$more_info'","TYPE":"'$type'"}, "geometry": { "type": "Point", "coordinates": ['\
                              $lon','$lat' ] }},' >>tmp.geojson;
                                done
echo "]}" >>tmp.geojson
