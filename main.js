//°C
//°F
let key = "1769e6366be36237e61944ffeec72d70";
let myList = [];
let myCity = "";
const numOfReports = 7;
const submitButton = document.querySelector("#submit");
const textBoxCity = document.querySelector("#city");
let weatherDisplay = document.querySelector("#weatherDisplay");
let radioBCelsius = document.querySelector("#Celcius");
let radioBfahrenheit = document.querySelector("#Fahrenheit");
let cityNameDisplay = document.querySelector("#city-name");

//Agarrar la temp inicial q viene en °C y
//la almacena en la unidad correcta
//sobre la base del radiobutton seleccionado
const setTemperature = (temp, unit) =>
  unit === "F" ? (temp * 9) / 5 + 32 : temp;

const getTime = (time) => {
  let temp = time.split(" ");
  temp = temp[1].split(":");
  return temp[0];
};

const giveMeUnit = () => {
  let radioF = document.querySelector("#Fahrenheit");
  return radioF.checked ? "°F" : "°C";
};

const getIconURL = (iconName) =>
  ` http://openweathermap.org/img/wn/${iconName}@2x.png`;

const converTemperature = (unit) => {
  for (let i = 0; i < myList.length; i++) {
    let {temp, unit: myUnit} = myList[i];
    console.log(myList[i]);
    myUnit = unit;
    if (unit === "°F") {
      temp = ((temp * 9) / 5 + 32).toFixed();
    } else {
      temp = (((temp - 32) * 5) / 9).toFixed();
    }
  }
};

const createMyList = (list) => {
  myList = [];
  for (let i = 0; i < numOfReports; i++) {
    const {dt_txt, main: {temp, humidity}, weather: [{main, icon}]} = list[i];
    let tempOriginal = temp / 10;
    tempOriginal = tempOriginal.toFixed();
    let myTemperature = setTemperature(tempOriginal, giveMeUnit());
    let forecast = {
      icon: getIconURL(icon),
      temp: myTemperature,
      unit: giveMeUnit(),
      humi: humidity,
      main: main,
      time: getTime(dt_txt),
    };
    myList.push(forecast);
  }
};

// const createMyList = (list) => {
//     myList = [];
//     for (let i = 0; i < numOfReports; i++) {
//       const element = list[i];
//       let tempOriginal = element.main.temp / 10;
//       tempOriginal = tempOriginal.toFixed();
//       let myTemperature = setTemperature(tempOriginal, giveMeUnit());
//       let forecast = {
//         icon: getIconURL(element.weather[0].icon),
//         temp: myTemperature,
//         unit: giveMeUnit(),
//         humi: element.main.humidity,
//         main: element.weather[0].main,
//         time: getTime(element.dt_txt),
//       };
//       myList.push(forecast);
//     }
//   };

// const createMyNewList = (list) => {
//   myList = [];
//   const currentTime = today.getHours();
//   for (let i = 0; i < numOfReports; i++) {
//     const element = list[i];
//     const elementTime = getTime(element.dt_txt);
//     if (currentTime >= elementTime) {
//       let tempOriginal = element.main.temp / 10;
//       tempOriginal = tempOriginal.toFixed();
//       let myTemperature = setTemperature(tempOriginal, giveMeUnit());
//       let forecast = {
//         icon: getIconURL(element.weather[0].icon),
//         temp: myTemperature,
//         unit: giveMeUnit(),
//         humi: element.main.humidity,
//         main: element.weather[0].main,
//         time: getTime(element.dt_txt),
//       };
//       myList.push(forecast);
//     }
//   }
// };
const drawFirstElement = () =>{
    console.log(myList[0]);
    let firstElement = myList[0]; 
    let mainReport = document.querySelector("#mainReport"); 
    let mainImg = document.createElement("img");
    mainImg.src = firstElement.icon;

    let mainTemperature = document.createElement("h1");
    mainTemperature.innerHTML = firstElement.temp;

    let mainUnit = document.createElement("a");
    mainUnit.innerHTML = firstElement.unit;

    mainReport.appendChild(mainImg);
    mainReport.appendChild(mainTemperature);
    mainReport.appendChild(mainUnit);


    cityNameDisplay.innerHTML = myCity;
}

const drawList = () => {
  weatherDisplay.innerHTML = "";
  cityNameDisplay.innerHTML = myCity;
  drawFirstElement();
  for (let i = 0; i < myList.length; i++) {
    const {temp, unit, humi, main, time, icon: iconSrc} = myList[i];
    let ulElement = document.createElement("ul");
    let icon = document.createElement("img");
    let liTemp = document.createElement("li");
    let liHum = document.createElement("li");
    let liMain = document.createElement("li");
    let liTime = document.createElement("li");
    icon.src = iconSrc;
    liTemp.innerHTML = `Temp: ${temp}${unit}`;
    liHum.innerHTML = `Hum: ${humi}%`;
    liMain.innerHTML = main;
    liTime.innerHTML = time;
    ulElement.appendChild(icon);
    ulElement.appendChild(liTemp);
    ulElement.appendChild(liHum);
    ulElement.appendChild(liMain);
    ulElement.appendChild(liTime);
    weatherDisplay.appendChild(ulElement);
  }
};

const createReportHTML = () => {
  weatherDisplay.innerHTML = "";
  drawFirstElement();  
  for (let i = 0; i < myList.length; i++) {
    const element = myList[i];
    let ulElement = document.createElement("ul");
    let icon = document.createElement("img");
    let liTemp = document.createElement("li");
    let liHum = document.createElement("li");
    let liMain = document.createElement("li");
    let liTime = document.createElement("li");
    icon.src = element.icon;
    liTemp.innerHTML = `Temp: ${element.temp}${element.unit}`;
    liHum.innerHTML = `Hum: ${element.humi}%`;
    liMain.innerHTML = element.main;
    liTime.innerHTML = element.time;
    ulElement.appendChild(icon);
    ulElement.appendChild(liTemp);
    ulElement.appendChild(liHum);
    ulElement.appendChild(liMain);
    ulElement.appendChild(liTime);
    weatherDisplay.appendChild(ulElement);
  }
};

const handleClick = (myRadio) => {
  myRadio.checked = true;
  if (myRadio.value !== myList[0].unit) {
    converTemperature(myRadio.value);
  }
  drawList();
};

const getInfoAPI = (cityName, keyAPI) => {
  //   let promise = fetch(
  //     `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${keyAPI}`
  //   );
  let promise = fetch("weather-app.json");
  promise
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      //   // Examine the text in the response
      response.json().then(function (data) {
        myCity = data.city.name;
        createMyList(data.list);
        console.log(data.list[0]);
        drawList();
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};

getInfoAPI("San Diego", key);

radioBCelsius.addEventListener("change", (evento) => {
  radioBfahrenheit.checked = false;
  let { target } = evento;
  handleClick(target);
});
radioBfahrenheit.addEventListener("change", (evento) => {
  radioBCelsius.checked = false;
  let target = evento.target;
  handleClick(target, radioBCelsius);
});

submitButton.addEventListener("click", (event) => {
  weatherDisplay.innerHTML = "";
  let cityName = textBoxCity.value;
  cityName !== "" ? getInfoAPI(cityName, key) : alert("enter a city");

  //console.log(cityName);
});

