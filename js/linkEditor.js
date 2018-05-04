$(document).ready(() => {
	const $expandBtn = $("#expandBtn");
	const $userInput = $("#userInput");
	const $changedLink = $("#changedLink");
	const $shortenBtn = $("#shortenBtn");
	const $executeBtn = $("#executeBtn");

	const apiKey = "AIzaSyDBTieLwd8CKwlWX_lbGNjLWmYhwl81ycQ";
	const url = "https://www.googleapis.com/urlshortener/v1/url";

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
				$changedLink.append(response.longUrl);
			})
			.fail(function() {
				$changedLink.append("Ссылка уже расширена");
			});
	};

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
				$changedLink.append(response.id);
			})
			.fail(function() {
				$changedLink.append("Ссылка уже укорочена");
			});
	};

	const shortenLinkEx = () => {
		if (!$userInput.val()) return false;

		getShortenLink();
		$changedLink.fadeIn();
	};

	const expandExecute = () => {
		if (!$userInput.val()) return false;

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
