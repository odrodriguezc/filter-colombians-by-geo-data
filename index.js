const request = require('request');
const fs = require('fs')
const options = {
    'method': 'GET',
    'url': 'https://www.datos.gov.co/api/id/y399-rzwf.json?$query=select%20*%2C%20%3Aid%20where%20(upper(%60pa_s%60)%20%3D%20upper(%27Francia%27))%20order%20by%20%60pa_s%60%20asc%20limit%201000000',
    'headers': {}
};

const latMarseille = 43.29500;
const lonMarseille = 5.37336
request(options, function (error, response) {
    if (error) throw new Error(error);
    fs.writeFile("data.json", response.body, 'utf8', function (err) {
        if (err) {
            console.log("An error occurred while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });

    const citizens = JSON.parse(response.body);
    let count = 0;
    for (const citizen of citizens) {
        const d = distance(
            latMarseille,
            lonMarseille,
            citizen.localizaci_n.latitude,
            citizen.localizaci_n.longitude,
            'K'
        );

        //console.log(citizen.localizaci_n.latitude, citizen.localizaci_n.longitude);

        if (distance <= 100) count++
    }
    console.log('total ', count);
})



function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    } else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 }
        if (unit === "N") { dist = dist * 0.8684 }

        return dist;
    }
}