let instance = null;
class MeteoAPP {

	constructor() {
		this.appid = document.body.dataset.appid || "685677c6a1fafb20e155188f3ad5b7d6";
		this.units = document.body.dataset.units || "metric";
		this.lang = document.body.dataset.lang || "fr";
		this.url = "//api.openweathermap.org/data/2.5/";
		this.coords = null;

		if (!this.appid) {
			throw new Error('Appid is not defined');
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				this.coords = position.coords;
				this.weather();
				this.hourlyWeather();
				this.dailyWeather();
			})
		}
	}

	weather() {
		let $weather = document.querySelector("#weather");
		if ($weather) {
			this.api('weather', {
				lat: this.coords.latitude,
				lon: this.coords.longitude
			}).then(response => {
				$weather.querySelector(".ciel").innerHTML = response.weather[0].description;
				$weather.querySelector(".minimal").innerHTML = Math.round(response.main.temp_min) + "°";
				$weather.querySelector(".maximal").innerHTML = Math.round(response.main.temp_max) + "°";
				$weather.querySelector(".current").innerHTML = Math.round(response.main.temp) + "°";
				console.log(response);
			});
		}
	}

	hourlyWeather() {
		let $hourlyWeather = document.querySelector("#prevision-hour");
		if ($hourlyWeather) {
			this.api('onecall', {
				lat: this.coords.latitude,
				lon: this.coords.longitude
			}).then(response => {
				for (let i = 0; i<12; i++) {
					const timestamp = response.hourly[i].dt;
					const eachHour = new Date(timestamp * 1000);
					const tableHour = document.getElementById("hours");
					const divHour = document.createElement('div');
					const text = document.createTextNode(eachHour.getHours() + "h");
					divHour.appendChild(text);
					tableHour.appendChild(divHour);

					const tableIcons = document.getElementById("icons-hours");
					const icons = response.hourly[i].weather[0].icon;
					const imgIcon = document.createElement('img');
					const url = "http://openweathermap.org/img/wn/";
					const url2 = '@2x.png';
					const uri = url + icons + url2;
					imgIcon.src = uri;
					tableIcons.appendChild(imgIcon);
					
					const temps = response.hourly[i].temp;
					const tableTemp = document.getElementById("temps-hours");
					const divTemp = document.createElement('div');
					const tempText = document.createTextNode(Math.round(temps) + "°");
					divTemp.appendChild(tempText);
					tableTemp.appendChild(divTemp);
				}
			})
		}
	}

	dailyWeather() {
		let $dailyWeather = document.querySelector("#prevision-day");
		if ($dailyWeather) {
			this.api('onecall', {
				lat: this.coords.latitude,
				lon: this.coords.longitude
			}).then(response => { 
				for (let i = 0; i<response.daily.length; i++) {
					const $tableDaily = document.getElementById("day");
					const $tableRowDaily = document.createElement("tr");

					const dates = new Date (response.daily[i].dt * 1000);
					const $tableDay = document.createElement("td");
					$tableDay.setAttribute('class', 'dayTable');
					const $dayText = document.createTextNode(dates);
					$tableDay.appendChild($dayText);
					$tableRowDaily.appendChild($tableDay);
					$tableDaily.appendChild($tableRowDaily);

					const status = response.daily[i].weather[0].description;
					const $tableTdStatus = document.createElement("td");
					$tableTdStatus.setAttribute('class', 'dayTable');
					const $statusText = document.createTextNode(status);
					$tableTdStatus.appendChild($statusText);
					$tableRowDaily.appendChild($tableTdStatus);
					$tableDaily.appendChild($tableRowDaily);

					const icons = response.daily[i].weather[0].icon;
					const url = "http://openweathermap.org/img/wn/";
					const url2 = '@2x.png';
					const uri = url + icons + url2;
					const $imgIcons = document.createElement('img');
					$imgIcons.src = uri;
					const $tableIcons = document.createElement("td");
					$tableIcons.setAttribute('class', 'dayTable');
					$tableIcons.appendChild($imgIcons);
					$tableRowDaily.appendChild($tableIcons);
					$tableDaily.appendChild($tableRowDaily);

					const tempMin = "min " + Math.round(response.daily[i].temp.min) + "°";
					const $tableTempMin = document.createElement("td");
					$tableTempMin.setAttribute('class', 'dayTable');
					const $tempMinText = document.createTextNode(tempMin);
					$tableTempMin.appendChild($tempMinText);
					$tableRowDaily.appendChild($tableTempMin);
					$tableDaily.appendChild($tableRowDaily);

					const tempMax = "max " + Math.round(response.daily[i].temp.max) + "°";
					const $tableTempMax = document.createElement("td");
					$tableTempMax.setAttribute('class', 'dayTable');
					const $tempMaxText = document.createTextNode(tempMax);
					$tableTempMax.appendChild($tempMaxText);
					$tableRowDaily.appendChild($tableTempMax);
					$tableDaily.appendChild($tableRowDaily);
				}
			})
		}
	}

	api(apiName, query = {}) {
		let url = this.url + apiName + "?appid=" + this.appid + "&units=" + this.units + "&lang=" + this.lang;
		for (let param in query) {
			url += "&" + param + "=" + query[param];
		}
		return fetch(url).then(response => response.json());
	}

	static run() {
		if (!instance) {
			instance = new this;
		}
		return instance;
	}

}

console.log(MeteoAPP.run());