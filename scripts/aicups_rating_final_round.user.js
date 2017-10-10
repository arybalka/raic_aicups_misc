// ==UserScript==
// @name         AICups misc
// @version      0.1
// @description  Fetch places and ratings for users
// @author       Andrey Rybalka (lama)
// @match        http://aicups.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var execute = function (body) {
        if(typeof body === "function") { body = "(" + body + ")();"; }
        var el = document.createElement("script");
        el.textContent = body;
        document.body.appendChild(el);
        return el;
    };

    execute(function() {
		var last_hash = document.location.hash;

		function processPage(doc) {
			var map = {};

			doc.find('.table.table-striped tbody tr').each(function () {
				var $tr = $(this);
				var index = $tr.find('td').eq(0).text().trim();
				var name = $tr.find('td').eq(1).text().trim();
				var rating = $tr.find('td').eq(2).text().trim();
				map[name] = {
					index: index,
					rating: rating
				};
			});

			var cells = [];
			var $t = $('.tab-pane.active table.table-hover.table-striped');
			$t.find('tbody tr').each(function () {
				var $td = $(this).find('td').eq(4);
				cells.push(
					{
						name: $td.find('a').eq(0).text(),
						$ver: $td.find('a').eq(1),
						type: 1
					}
				);
				cells.push(
					{
						name: $td.find('a').eq(2).text(),
						$ver: $td.find('a').eq(3),
						type: 1
					}
				);
			});

			if (document.location.pathname.indexOf('/profile/') >= 0) {
				var $h = $('h4.media-heading').first();
				cells.push(
					{
						name: $h.text(),
						$ver: $h,
						type: 2
					}
				);
			}

			//console.log(map);
			cells.forEach(function (el) {
				if (typeof map[el.name] !== 'undefined') {
					//console.log(map[el.name]);
					var t = el.$ver.text().replace('(', '').replace(')', '').trim();
					if (t.indexOf('/') >= 0) return;
					var me = map[el.name];

					if (el.type == 1) {
						//el.$ver.html(`<strong style="background-color: #afb6bc; color: #fff; padding: 0 3px; font-weight: normal; line-height: normal">${me.index}</strong> <em>(${t}/${me.rating})</em>`);
						el.$ver.html(`<strong>${me.index}</strong> <em>(${t}/${me.rating})</em>`);
					} else if (el.type == 2) {
						el.$ver.html(`${el.name}&nbsp;&nbsp;<strong style="background-color: #838383; color: #fff; padding: 0 5px; font-weight: normal; line-height: normal">${me.index}</strong>`);
					}
				}
			});

			return cells;
		}

		function load_ratings() {
			$.get('http://aicups.ru/rating/', function (html) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(html, "text/html");
				processPage($(doc.body));
			});
		}

		window.setInterval(function () {
			var hash = document.location.hash;
			if (hash != last_hash) {
				last_hash = hash;

				if (hash == '#ranked-games' || hash == '#unranked-games') {
					load_ratings();
				}
			}
		}, 200);

		load_ratings();
	});

})();