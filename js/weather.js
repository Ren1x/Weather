$(document).ready(() => {
	// Для проверки с чего зашел пользователь
	const isMobile = window.matchMedia("only screen and (max-width: 760px)");
	const $userInput = $("#userInput");
	// общий блок погоды
	const $sectionContainer = $("#sectionContainer");
	// блоки с погодой
	const $section = [
		$("#weather1"),
		$("#weather2"),
		$("#weather3"),
		$("#weather4"),
		$("#weather5"),
		$("#weather6"),
		$("#weather7")
	];
	const $search = $("#search");
	const $dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

	//запрашивает данные о погоде
	const weather = async () => {
		let urlApixui =
			"http://api.apixu.com/v1/forecast.json?key=a9ac3c69cdb8499ead524551172606&q=" +
			$userInput.val() +
			"&days=7&lang=ru";
		try {
			let response = await fetch(urlApixui);
			if (response.ok) {
				let jsonResponse = await response.json();
				console.log(jsonResponse);
				return jsonResponse;
			}
		} catch (error) {
			err(error);
		}
	};

	const createBlockOfWeather = weatherData => {
		//очищаем блоки с погодой
		$section.forEach(section => section.empty());

		//Создание блоков погоды с днями недели
		addWeatherOnBlock(weatherData);

		// Блок с погодой появляется
		$sectionContainer.show(300);

		// Возвращаем текст погоды для changeBackground()
		return weatherData.current.condition.text;
	};

	const addWeatherOnBlock = weatherData => {
		//для сокращения кода в переборе следующей функции
		let days = weatherData.forecast.forecastday;

		$section.forEach((section, i) => {
			let info;
			// основной блок?
			i === 0
				? section.append(addMainBlockWeather(weatherData, days))
				: (info =
						'<img src="http:' +
						days[i].day.condition.icon +
						'">' +
						"<p class='d-none d-md-block'>" +
						days[i].day.condition.text +
						"</p>" +
						"<p> <span class='temperature'>" +
						days[i].day.maxtemp_c +
						"&deg; </span> / <span class='temperature'>" +
						days[i].day.mintemp_c +
						"&deg;</span></p>" +
						"<h6>" +
						$dayOfWeek[new Date(days[i].date).getDay()] +
						" (" +
						days[i].date.slice(5).replace("-", ".") +
						")</h6>");
			section.append(info);
		});
	};

	const addMainBlockWeather = (weatherData, days) => {
		let currentDay =
			"<div class='container'>" +
			"<div class='row'>" +
			"<div class='col-md-6 col-6 verticalHt'>" +
			"<p><span class='temperature'>" +
			weatherData.current.temp_c +
			"&deg;</span></p>" +
			"<img src='http:" +
			weatherData.current.condition.icon +
			"'></img>" +
			"<p class='d-sm-block'>" +
			weatherData.current.condition.text +
			"</p>" +
			"<p>Сейчас по ощущению " +
			weatherData.current.feelslike_c +
			"&deg;</p>" +
			"</div>" +
			"<div class='col-md-6 col-6'>" +
			"<p class='text-nowrap'><span class='temperature'> " +
			days[0].day.maxtemp_c +
			"&deg;</span> / <span class='temperature'>" +
			days[0].day.mintemp_c +
			"&deg;</span></p>" +
			'<img src="http:' +
			days[0].day.condition.icon +
			'">' +
			"<p>" +
			days[0].day.condition.text +
			"</p>" +
			"<h6>Сегодня " +
			$dayOfWeek[new Date().getDay()] +
			" (" +
			days[0].date.slice(5).replace("-", ".") +
			")</h6>" +
			"</div>" +
			"</div>" +
			"</div>";
		return currentDay;
	};

	// Меняет фон в зависимости от погоды
	const changeBackground = condition => {
		$("body").removeClass();

		let mobile = "";

		//Проверяем с чего зашел пользователь
		if (isMobile.matches) {
			mobile = "mobile_";
		}

		let newCondition = condition.toLowerCase();

		if (
			~newCondition.indexOf("дожд") ||
			~newCondition.indexOf("гроз") ||
			~newCondition.indexOf("морось")
		) {
			$("body").addClass(mobile + "rain");
		} else if (~newCondition.indexOf("облачн")) {
			$("body").addClass(mobile + "cloudy");
		} else if (
			~newCondition.indexOf("ясн") ||
			~newCondition.indexOf("солнечн")
		) {
			$("body").addClass(mobile + "sun");
		} else if (
			~newCondition.indexOf("сне") ||
			~newCondition.indexOf("метел")
		) {
			$("body").addClass(mobile + "snow");
		} else {
			$("body").addClass("defaultWeather");
		}

		mobile = "";
	};

	const err = e => {
		if (e.name === "TypeError") {
			$userInput.addClass("is-invalid");
		} else {
			alert("Ошибка соединения");
		}
	};

	//Прячет блок с погодой и убирает ошибку ввода(если есть)
	const clearStyle = () => {
		$userInput.removeClass("is-invalid");
		$sectionContainer.hide(700);
	};

	const nameOfCity = () => {
		let cityName =
			$userInput
				.val()
				.slice(0, 1)
				.toUpperCase() + $userInput.val().slice(1);
		$("#city").text(cityName);
		$userInput.val("");
	};

	const executeSearch = () => {
		console.log('fddf');
		clearStyle();

		weather()
			.then(weather => createBlockOfWeather(weather))
			.then(condition => changeBackground(condition))
			.catch(e => err(e));

		nameOfCity();

		return false;
	};

	$search.click(executeSearch);
});