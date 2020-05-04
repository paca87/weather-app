
// let key = "1769e6366be36237e61944ffeec72d70";
let myList = [];
const numOfReports = 7;
let weatherDisplay = document.querySelector("#weatherDisplay");

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
    createMyList(data.list);
    drawList();
    console.log(myList);
  });
}).catch(function (err) {
  console.log("Fetch Error :-S", err);
});
//°C
//°F
function createMyList(list) {
  for (let i = 0; i < numOfReports; i++) {
    const element = list[i];
    let tempOriginal = element.main.temp / 10;
    tempOriginal = tempOriginal.toFixed();
    let myTemperature = setTemperature(tempOriginal, giveMeUnit());
    let forecast = {
      icon: getIconURL(element.weather[0].icon),
      temp: myTemperature,
      unit: giveMeUnit(),
      humi: element.main.humidity,
      main: element.weather[0].main,
    };
    myList.push(forecast);
  }
}
//Agarrar la temp inicial q viene en °C y
//la almacena en la unidad correcta
//sobre la base del radiobutton seleccionado
function setTemperature(temp, unit) {
  return unit === "F" ? (temp * 9) / 5 + 32 : temp;
}
function drawList() {  
    weatherDisplay.innerHTML = "";
  for (let i = 0; i < myList.length; i++) {
    const element = myList[i];
    let ulElement = document.createElement("ul");
    let icon = document.createElement("img");
    let liTemp = document.createElement("li");
    let liHum = document.createElement("li");
    let liMain = document.createElement("li");
    icon.src = element.icon;
    liTemp.innerHTML = `Temp: ${element.temp}${element.unit}`;
    liHum.innerHTML = `Hum: ${element.humi}%`;
    liMain.innerHTML = `${element.main}`;
    ulElement.appendChild(icon);
    ulElement.appendChild(liTemp);
    ulElement.appendChild(liHum);
    ulElement.appendChild(liMain);
    weatherDisplay.appendChild(ulElement);
  }
}

function giveMeUnit() {
  let radioF = document.querySelector("#F");
  return radioF.checked ? "°F" : "°C";
}
function getIconURL(iconName) {
  return ` http://openweathermap.org/img/wn/${iconName}@2x.png`;
}

function converTemp(unit) {
  for (let i = 0; i < myList.length; i++) {
    const element = myList[i];
    element.unit = unit;
    if (unit === "°F") {
        element.temp = ((element.temp * 9) / 5 + 32).toFixed();
    }
    else{
        element.temp = ((element.temp - 32) * 5/9).toFixed();
    }
  }
}
function handleClick(myRadio) {
  if (myRadio.value !== myList[0].unit) {
    converTemp(myRadio.value);
  }
  drawList();
}

