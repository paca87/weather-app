//°C
//°F
let key = "1769e6366be36237e61944ffeec72d70";
let myList = [];
let myCity = "";
let myCountry = "";
const numOfReports = 7;
const submitButton = document.querySelector("#submit");
const textBoxCity = document.querySelector("#city");
let weatherDisplay = document.querySelector("#weatherDisplay");
let radioBCelsius = document.querySelector("#Celcius");
let radioBfahrenheit = document.querySelector("#Fahrenheit");
let unitDIV = document.querySelector("#unitDIV");
let mainReport = document.querySelector("#mainReport");

//Agarrar la temp inicial q viene en °C y
//la almacena en la unidad correcta
//sobre la base del radiobutton seleccionado
const setTemperature = (temp, unit) =>
  unit === "F" ? (temp * 9) / 5 + 32 : temp;

const getTime = (time) => {
  let temp = time.split(" ");
  temp = temp[1].split(":");
  return temp[0] >= 12 ? `${temp[0]}pm` : `${temp[0]}am`;
};

const giveMeUnit = () => {
  let radioF = document.querySelector("#Fahrenheit");
  return radioF.checked ? "°F" : "°C";
};

const getIconURL = (iconName) =>
  `http://openweathermap.org/img/wn/${iconName}@2x.png`;

const converTemperature = (myUnit) => {
  for (let i = 0; i < myList.length; i++) {
    let temp = myList[i].temp;
    myList[i].unit = myUnit;
    if (myUnit === "°F") {
      temp = ((temp * 9) / 5 + 32).toFixed();
    } else {
      temp = (((temp - 32) * 5) / 9).toFixed();
    }
    myList[i].temp = temp;
  }
};

const createMyList = (list) => {
  myList = [];
  for (let i = 0; i < numOfReports; i++) {
    const {
      dt_txt,
      main: { temp, humidity },
      weather: [{ main, icon }],
    } = list[i];
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

const drawList = () => {
  mainReport.innerHTML = "";
  //Div para City
  let cityNameDisplay = document.createElement("div");
  cityNameDisplay.className = "main-city";
  cityNameDisplay.innerHTML = `${myCity}, ${myCountry}`;
  mainReport.appendChild(cityNameDisplay);
  //Div para los partes
  let forecastList = document.createElement("div");
  forecastList.className = "forecast-list";
  mainReport.appendChild(forecastList);
  //Agregar Partes
  for (let i = 0; i < myList.length; i++) {
    const { temp, unit, humi, time, icon: iconSrc } = myList[i];

    let mainTime = document.createElement("div");
    mainTime.className = "main-time";
    mainTime.innerHTML = time;

    let mainImg = document.createElement("img");
    mainImg.src = iconSrc;

    let mainVariables = document.createElement("div");
    mainVariables.className = "main-variables";
    let layoutTemperature = document.createElement("div");
    layoutTemperature.className = "layout-temperature";
    let layoutHumidity = document.createElement("div");

    let mainTemperature = document.createElement("div");
    mainTemperature.innerHTML = temp;
    mainTemperature.className = "main-temperature";

    let mainUnit = document.createElement("div");
    mainUnit.innerHTML = unit;
    mainUnit.className = "main-unit";

    layoutTemperature.appendChild(mainTemperature);
    layoutTemperature.appendChild(mainUnit);

    let mainHumidity = document.createElement("div");
    mainHumidity.innerHTML = `${humi}%`;
    mainHumidity.className = "main-humidity";
    layoutHumidity.appendChild(mainHumidity);
    mainVariables.appendChild(layoutTemperature);
    mainVariables.appendChild(layoutHumidity);

    let singleFullReport = document.createElement("div");
    singleFullReport.className = "single-full-report";
    let singleReportInfo = document.createElement("div");
    singleReportInfo.className = "single-report";
    singleReportInfo.appendChild(mainImg);
    singleReportInfo.appendChild(mainVariables);
    singleFullReport.appendChild(mainTime);
    singleFullReport.appendChild(singleReportInfo);
    forecastList.appendChild(singleFullReport);
  }
};

const handleClick = (myRadio) => {
  myRadio.checked = true;
  if (myRadio.value !== myList[0].unit) {
    console.log(myRadio.value);
    myRadio.value === "°C"
      ? (radioBfahrenheit.checked = false)
      : (radioBCelsius.checked = false);
    converTemperature(myRadio.value);
  }
  drawList();
};

const getInfoAPI = (cityName, keyAPI) => {
  let promise = fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${keyAPI}`
  );
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
        radioBCelsius.checked = true;
        radioBfahrenheit.checked = false;
        let {
          city: { name, country },
        } = data;
        myCity = name;
        myCountry = country;
        createMyList(data.list);
        drawList();
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
};

getInfoAPI("San Diego", key);
submitButton.addEventListener("click", (event) => {
  weatherDisplay.innerHTML = "";
  let cityName = textBoxCity.value;
  cityName !== "" ? getInfoAPI(cityName, key) : alert("enter a city");
});

unitDIV.addEventListener("click", (event) => {
  let { target } = event;
  if (target.type == "radio") handleClick(target);
});
