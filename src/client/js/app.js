

const trip = {};
const geonamesUrl = 'http://api.geonames.org/';
const geonamesKey = 'Abrar171';
const geonamesQuery = 'searchJSON?formatted=true&q=';

const darkSkyURL = 'https://api.darksky.net/forecast/';
const darkSkyKey = '92fc38a17662c902275ab499697df55b';

const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabayKey = '17149173-75e27d9e7517a699a2c1a1fbf';



const handleSearch = async (e) => {
  e.preventDefault();
  let submitBtn = document.querySelector('#btn-trip-info')
  submitBtn.value = 'Loading...'

  trip.city = getCity();
  trip.start = getTripStart();
  trip.end = getTripEnd();
  trip.duration = countdown(new Date(trip.start), new Date(trip.end))
  const today = new Date()
  trip.countdown = countdown(today, new Date(trip.start))

  const geoLocation = await getGeoLocation(trip.city);

  trip.latitude = geoLocation.latitude;
  trip.longitude = geoLocation.longitude;
  trip.countryCode = geoLocation.countryCode;

  trip.weatherForecast = await getWeatherForecast(geoLocation.latitude, geoLocation.longitude);
  console.log(trip.weatherForecast)
  const countryInfo = await getCountryInfo(trip.countryCode);

  trip.country = countryInfo.name;
  trip.countryFlag = countryInfo.flag;

  trip.image = await getImageURL(trip.city, trip.country);

  console.log(trip);
  updateUI(trip);
  submitBtn.value = 'Get Trip Info'

  // postData('http://localhost:8080/save', trip);

  return trip;
}

const postData = async ( url='', data={} ) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  try {
    const newData = await response.json();
    //console.log(newData);
    return newData;
  } catch(error) {
    console.log(error);
  };

};

// Get user location and date input on  submit
const getCity = () => {

  let city = document.getElementById('place').value;

  city = city.toLowerCase();
  city = city[0].toUpperCase() + city.slice(1);

  console.log(city);

  return city;
}

const getTripStart = () => {

  const date = document.getElementById('date').value;

  return date;
}

const getTripEnd = () => {
  const date = document.getElementById('endDate').value;

  return date;
}

const countdown = (start, end) => {

  const tripStart = Date.parse(start);
  const tripEnd = Date.parse(end);

  const countdown = tripEnd - tripStart;

  const daysLeft = Math.ceil(countdown / 86400000);

  console.log(daysLeft);

  return daysLeft;
}

async function getGeoLocation(location) {
  const endpoint = geonamesUrl + geonamesQuery + location + '&username=' + geonamesKey + '&style=full';
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const location = {};
      const jsonRes = await response.json();

      location.latitude = jsonRes.geonames[0].lat;
      location.longitude = jsonRes.geonames[0].lng;
      location.countryCode = jsonRes.geonames[0].countryCode;

      console.log(location);
      return location;
    }
  } catch (error) {
    console.log(error);
  }
}


async function getWeatherForecast(latitude, longitude) {
  const endpoint = darkSkyURL + darkSkyKey + `/${latitude}, ${longitude}`;
  try {
    const response = await fetch('http://localhost:8080/forecast',
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: endpoint })
      });
    if (response.ok) {
      const jsonRes = await response.json();
      console.log(jsonRes);
      return jsonRes;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getImageURL(city, country) {
  const queryCity = `&q=${city}&image_type=photo&pretty=true&category=places`;
  const queryCountry = `&q=${country}&image_type=photo&pretty=true&category=places`

  const cityEndpoint = pixabayURL + pixabayKey + queryCity;
  const countryEndpoint = pixabayURL + pixabayKey + queryCountry;
  try {
    let response = await fetch(cityEndpoint);
    if (response.ok) {
      let jsonRes = await response.json();
      if (jsonRes.totalHits === 0) {
        // If not, display pictures for the country
        response = await fetch(countryEndpoint);
        if (response.ok) {
          jsonRes = await response.json();
          return jsonRes.hits[0].largeImageURL;
        }
      }
      // console.log(jsonRes);
      // console.log(jsonRes.hits[0].largeImageURL);
      return jsonRes.hits[0].largeImageURL;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCountryInfo(countryCode) {
  const endpoint = `https://restcountries.eu/rest/v2/alpha/${countryCode}`
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const jsonRes = await response.json();
      return {
               name: jsonRes.name,
               flag: jsonRes.flag
            }
    }
  } catch (error) {
    console.log(error);
  }
}



const updateUI = (newData) => {

  let cityImage = document.getElementById('city-img');
  cityImage.src = newData.image;

  const weather_data = {
    theLow : newData.weatherForecast.daily.data[0].temperatureLow,
    theHigh: newData.weatherForecast.daily.data[0].temperatureHigh,
    theSummary: newData.weatherForecast.currently.summary
  }

  let high = document.getElementById('high');
  high.textContent = weather_data.theHigh;

  let low = document.getElementById('low');
  low.textContent = weather_data.theLow;

  let summary = document.getElementById('summary');
  summary.textContent = weather_data.theSummary;

  let theDepartingDate = document.getElementById('departingDate');
  theDepartingDate.textContent = newData.start;

  let theLocation = document.getElementById('departingLocation');
  theLocation.textContent = newData.city;

  let theMainLocation = document.getElementById('mainLocation');
  theMainLocation.textContent = newData.city;

  let theTimeSpan = document.getElementById('timeSpan');
  theTimeSpan.textContent = newData.countdown + ' days away';

  let tripLengthDuration = document.getElementById('tripLength');
  tripLengthDuration.textContent = newData.duration + " Days";

}
const view_prev = (demoData, test=false) => {
   if(!test) {
     let cityImage = document.getElementById('city-img');
     cityImage.src = demoData[0].theImage;

     let high = document.getElementById('high');
     high.textContent = demoData[0].theHigh;

     let low = document.getElementById('low');
     low.textContent = demoData[0].theLow;

     let summary = document.getElementById('summary');
     summary.textContent = demoData[0].theSummary;

     let theDepartingDate = document.getElementById('departingDate');
     theDepartingDate.textContent = demoData[0].departureDate;

     let theLocation = document.getElementById('departingLocation');
     theLocation.textContent = demoData[0].fromText;

     let theMainLocation = document.getElementById('mainLocation');
     theMainLocation.textContent = demoData[0].fromText;

     let theTimeSpan = document.getElementById('timeSpan');
     theTimeSpan.textContent = demoData[0].tripDays;

     let tripLengthDuration = document.getElementById('tripLength');
     tripLengthDuration.textContent = demoData[0].mainTripDifference + " Days";
   }
   return demoData

}
export {  view_prev, updateUI, getGeoLocation, getImageURL, getCountryInfo, getWeatherForecast,handleSearch, getCity, getTripStart, getTripEnd, countdown};
