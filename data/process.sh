#! /bin/bash
MAPSAPIURL="http://maps.googleapis.com/maps/api/geocode/json"

#curl -XGET 'https://docs.google.com/spreadsheets/d/1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC5VU/export?format=csv&id=1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC5VU&gid=0' -o raw_data.csv

echo 'var edificios = {
"type": "FeatureCollection",
"features": [' > tmp.geojson
tail --lines=+2 raw_data.csv | while read line; do\
                                lat=`echo $line|awk -v FS="," '{print $1}'`;
                                lon=`echo $line|awk -v FS="," '{print $2}'`;
                                status=`echo $line|awk -v FS="," '{print $3}'`;
                                name=`echo $line|awk -v FS="," '{print $4}'`;
                                #Ask by address
                                address="86 White Street";
                                curl -G -s --data sensor=true --data-urlencode latlng=$lat,$lon "$MAPSAPIURL" -o result.json
                                address=`jq '.results[]|.formatted_address' result.json | head -n1 | sed "s/\"//g"`
                                echo '{ "type": "Feature", "properties": { "ADDRESS": "'$address\
                                      '", "STATUS":'$status', "NAME": "'$name'"}, "geometry": { "type": "Point", "coordinates": ['\
                                      $lon','$lat' ] }},' >>tmp.geojson;\
                                done
echo "]}" >>tmp.geojson
