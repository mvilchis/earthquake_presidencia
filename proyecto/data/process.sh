#! /bin/bash
MAPSAPIURL="http://maps.googleapis.com/maps/api/geocode/json"
#PATH_FILE="/home/mvilchis/Desktop/Presidencia/bomberazo/proyecto/data"
PATH_FILE="/var/www/data"
curl -XGET 'https://docs.google.com/spreadsheets/d/1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC5VU/export?format=csv&id=1YRDBbyOw7IP4MZxYrl77uUl2ck6jsuZGms04MSOC#5VU&gid=0' -o PATH_FILE"/raw_data.csv"
echo "" >>PATH_FILE"/raw_data.csv"
#Ask by address
#curl -G -s --data sensor=true --data-urlencode latlng=$lat,$lon "$MAPSAPIURL" -o result.json
#address=`jq '.results[]|.formatted_address' result.json | head -n1 | sed "s/\"//g"`
#rm result.json
echo 'var edificios = {
"type": "FeatureCollection",
"features": [' > $PATH_FILE"/final.geojson"
tail --lines=+2 PATH_FILE"/raw_data.csv" | while read line; do\
                              lat=`echo $line|csvcut -c 1|tr "\"" " "`;
                              lon=`echo $line|csvcut -c 2|tr "\"" " "`;
                              status=`echo $line|csvcut -c 3|tr "\"" " "`;
                              name=`echo $line|csvcut -c 4|tr "\"" " "`;
                              type=`echo $line|csvcut -c 5|tr "\"" " "`;
                              more_info=`echo $line|csvcut -c 6|tr "\n" " "|tr "\"" " "`;
                              address=`echo $line|csvcut -c 7|tr "\n" " "|tr "\"" " "`;
                              echo '{ "type": "Feature", "properties": { "ADDRESS": "'$address\
                              '", "STATUS":'$status', "NAME": "'$name'","MORE_INFO":"'$more_info'","TYPE":"'$type'"}, "geometry": { "type": "Point", "coordinates": ['\
                              $lon','$lat' ] }},' >>$PATH_FILE"/final.geojson";
                                done
echo "]}" >>final.geojson
