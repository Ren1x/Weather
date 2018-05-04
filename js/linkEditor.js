$(document).ready(() => {
	const $userInput = $("#userInput");
	const $executeBtn = $("#executeBtn"); 	// Блок с кнопками, для проверки нажатой
	const $expandBtn = $("#expandBtn");
	const $shortenBtn = $("#shortenBtn");
	const $changedLink = $("#changedLink"); // Блок с выводом новой ссылки

	// Ключ API с адрессом
	const apiKey = "AIzaSyDBTieLwd8CKwlWX_lbGNjLWmYhwl81ycQ";
	const url = "https://www.googleapis.com/urlshortener/v1/url";

	// Функция для получения расширенной ссылки
	const getExpandLink = () => {
		let urlToShorten =
			"https://www.googleapis.com/urlshortener/v1/url?key=" +
			apiKey +
			"&shortUrl=" +
			$userInput.val();

		// $.get(urlToShorten, function(response) {
		// 	$changedLink.append(response.longUrl);
		// });

		$.ajax({
			url: urlToShorten,
			type: "GET",
			dataType: "json"
		})
			.done(function(response) {
				$changedLink.append(
					`<h5>Расширенная ссылка:</h5> ${response.longUrl}`
				);
			})
			.fail(function() {
				$changedLink.append("<h5>Введите ссылку для расширения</h5>");
			});
	};

	// Функция для получения короткой ссылки
	const getShortenLink = () => {
		const urlToExpand = url + "?key=" + apiKey;
		let urlTo = $userInput.val();

		$.post({
			url: urlToExpand,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({ longUrl: urlTo })
		})
			.done(function(response) {
				console.log(response);
				$changedLink.append(
					`<h5>Укороченная ссылка:</h5> ${response.id}`
				);
			})
			.fail(function() {
				$changedLink.append("<h5>Введите ссылку для сокращения</h5>");
			});
	};


	const shortenLinkEx = () => {
		if (!$userInput.val()) return false; //Отмена, если поле ввода пустое

		getShortenLink();
		$changedLink.fadeIn();
	};

	const expandExecute = () => {
		if (!$userInput.val()) return false; //Отмена, если поле ввода пустое

		getExpandLink();
		$changedLink.fadeIn();
	};

	const clearBlock = () => {
		$changedLink.hide("fast");
		$changedLink.empty();
	};

	const execute = e => {
		clearBlock();

		if (e.target.id === "expandBtn") {
			expandExecute();
		} else if (e.target.id === "shortenBtn") {
			shortenLinkEx();
		} else {
			return false;
		}

		return false;
	};

	$executeBtn.click(execute);
});
