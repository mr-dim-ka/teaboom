function setCardData(card, option) {
	const article = option.dataset.article || "";
	const price = parsePrice(option.dataset.price);
	const oldPrice = parsePrice(option.dataset.oldPrice);

	card.querySelectorAll(".js-card-option").forEach((item) => {
		item.classList.remove("active");
	});

	option.classList.add("active");

	const articleEl = card.querySelector(".js-article");

	if (articleEl) {
		articleEl.textContent = article;
	}

	const priceEl = card.querySelector(".js-price");

	if (priceEl && price !== null) {
		priceEl.textContent = `${formatPrice(price)} ₽`;
	}

	const oldPriceEl = card.querySelector(".js-old-price");

	if (oldPriceEl) {
		if (oldPrice !== null && oldPrice > price) {
			oldPriceEl.textContent = `${formatPrice(oldPrice)} ₽`;
			oldPriceEl.hidden = false;
		} else {
			oldPriceEl.textContent = "";
			oldPriceEl.hidden = true;
		}
	}

	const discountEl = card.querySelector(".js-discount");

	if (discountEl) {
		if (oldPrice !== null && price !== null && oldPrice > price) {
			const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

			discountEl.textContent = `-${discount}%`;
			discountEl.hidden = false;
		} else {
			discountEl.textContent = "";
			discountEl.hidden = true;
		}
	}
}

function parsePrice(value) {
	if (!value) return null;

	const result = parseFloat(
		String(value)
			.replace(/\s/g, "") //
			.replace(",", "."),
	);

	return Number.isFinite(result) ? result : null;
}

function formatPrice(value) {
	return value.toLocaleString("ru-RU", {
		// minimumFractionDigits: 2,
		// maximumFractionDigits: 2,
	});
}

function toggleActiveClassByClick() {
	document.addEventListener("click", function (event) {
		const block = event.target.closest(".js-toggle-active-click");

		if (block) {
			event.preventDefault();
			block.classList.toggle("active");
		}
	});
}

function initTabs() {
	const tabContainers = document.querySelectorAll(".js-tabs");
	if (!tabContainers.length) {
		return;
	}
	tabContainers.forEach((container) => {
		const tabsTitles = [...container.querySelector(".js-tabs-navigation").children];
		const tabBodies = [...container.querySelector(".js-tabs-content").children];

		tabBodies.forEach((el) => {
			if (!el.classList.contains("show")) {
				el.classList.add("hidden");
			}
		});

		tabsTitles.forEach((tabsTitle) => {
			tabsTitle.addEventListener("click", function () {
				// Убираем класс active у всех табов
				tabsTitles.forEach((t) => t.classList.remove("active"));

				// Добавляем класс active текущему табу
				tabsTitle.classList.add("active");

				// Получаем индекс текущего таба
				const index = Array.from(tabsTitles).indexOf(tabsTitle);

				// Скрываем все содержимое табов
				tabBodies.forEach((body) => {
					body.classList.remove("show");
					if (!body.classList.contains("show")) {
						body.classList.add("hidden");
					}
				});

				// Показываем соответствующее содержимое таба
				tabBodies[index].classList.add("show");
				tabBodies[index].classList.remove("hidden");
			});
		});
	});
}

function initSliders() {
	var swiper = new Swiper(".js-thumbs-swiper", {
		loop: false,
		spaceBetween: 10,
		slidesPerView: 3,
		freeMode: true,
		watchSlidesProgress: true,
	});

	var swiper2 = new Swiper(".js-main-swiper", {
		loop: false,
		spaceBetween: 10,
		navigation: {
			nextEl: ".js-main-swiper .swiper-button-next",
			prevEl: ".js-main-swiper .swiper-button-prev",
		},
		thumbs: {
			swiper: swiper,
		},
	});
}

function initFancyBox(currentSettings) {
	const defaultSettings = {
		gallery: {
			buttons: ["zoom", "slideShow", "thumbs", "close"],
		},
	};

	const settingsToUse = currentSettings || defaultSettings;

	Object.keys(settingsToUse).forEach((currentGallery) => {
		const fancyElems = $(`[data-fancybox="${currentGallery}"]`);

		if (fancyElems.length) {
			fancyElems.fancybox(settingsToUse[currentGallery]);
		}
	});
}

function initListClickHandler() {
	document.addEventListener("click", (event) => {
		const wrap = event.target.closest(".js-list-wrap");
		const opener = event.target.closest(".js-list-opener");
		const closer = event.target.closest(".js-list-closer");
		const toggle = event.target.closest(".js-list-toggle");

		if (!wrap) return;

		if (opener) {
			document.documentElement.classList.add("lock");
			wrap.classList.add("active");
			return;
		}

		if (closer) {
			document.documentElement.classList.remove("lock");
			wrap.classList.remove("active");
			return;
		}

		if (toggle) {
			event.preventDefault();

			const list = wrap.querySelector(".js-list");

			if (!list) return;

			list.querySelectorAll(".js-list-item").forEach((item) => {
				item.classList.toggle("hidden");
			});
		}
	});
}

function initCardOptions() {
	document.querySelectorAll(".js-card").forEach((card) => {
		const options = card.querySelectorAll(".js-card-option");

		if (!options.length) return;

		// При загрузке выбираем первый вариант
		setCardData(card, options[0]);

		// Переключение варианта
		options.forEach((option) => {
			option.addEventListener("click", () => {
				setCardData(card, option);
			});
		});
	});
}

//! ==========================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
	toggleActiveClassByClick();
	initListClickHandler();
	initCardOptions();
	initTabs();
	initSliders();
	initFancyBox();
});
