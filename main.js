//let path = "/api/location/search/?query=";

let city = "london";
let root = `/api/location/search/?query=${city}`;
let path = root;
console.log(path);
let key = "1769e6366be36237e61944ffeec72d70";

//let path = "/api/location/search/?query=";

//let p = fetch('http://api.openweathermap.org/data/2.5/forecast?q=London&appid=41e2a23f88602f4cdbe27277677d0639');
let p = fetch("weather-app.json");

p.then(function (response) {
  if (response.status !== 200) {
    console.log(
      "Looks like there was a problem. Status Code: " + response.status
    );
    return;
  }
  // Examine the text in the response
  response.json().then(function (data) {
    console.log(data.list);
    drawList(data.list);
  });
}).catch(function (err) {
  console.log("Fetch Error :-S", err);
});
//°C
//°F
function drawList(list){
    let weatherDisplay = document.querySelector("#weatherDisplay");
    
    for (let i = 0; i < 7; i++) {
        const element = list[i];
        let ulElement = document.createElement("ul");
        let icon = document.createElement("img");
        let liTemp = document.createElement("li");
        let liHum = document.createElement("li");
        let liMain = document.createElement("li");
        icon.src = giveMeIcon(element.weather[0].icon);
        liTemp.innerHTML = converTemp(element.main.temp);
        liHum.innerHTML = `<li>Hum: ${element.main.humidity}%</li>`;
        liMain. innerHTML = `<li>${element.weather[0].main}</li>`;
        ulElement.appendChild(icon);
        ulElement.appendChild(liTemp);
        ulElement.appendChild(liHum);   
        ulElement.appendChild(liMain);
        //weatherDisplay.appendChild(icon);      
        weatherDisplay.appendChild(ulElement);        
    }
}

function converTemp(element){
    let temp = parseInt(element)/10;
    let radioF = document.querySelector("#F");
    let unit = radioF.checked ? "°F" : "°C";
    let result = `<li>Temp: ${temp}${unit}</li>`;
    return result;    
}
function giveMeIcon(iconName){
    return ` http://openweathermap.org/img/wn/${iconName}@2x.png`;
}
//console.log('weqwe');
