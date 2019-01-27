// ==UserScript==
// @name         RAIC, Hide match results until clicked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://russianaicup.ru/profile/*
// @grant        none

// ==/UserScript==
(function () {
	'use strict';

	$('.gamesTable tr:gt(0)').each(function (i, e) {
		if ($(e).find('td').length == 8) return;

		let tds = [];
		for (let i = 5; i <= 9; i++) tds.push(`td:nth-child(${i})`);
		tds = $(e).find(tds.join(', '));

		let td4 = $(e).find('td:nth-child(4)');
		let td5 = $(e).find('td:nth-child(5)');

		let my_td = $('<td />').attr('colspan', 5).css('position', 'relative').insertAfter(td4);
		let my_td_content = $('<div />').css({
			'position': 'absolute',
			'top': '50%',
			'left': 0,
			'right': 0,
			'height': '30px',
			'margin-top': '-15px',
			'font-size': '14pt',
			'cursor': 'pointer'
		});

		let players = [];
		players.push({
			'pic': td5.find('a:nth-child(1)').clone(),
			'name': td5.find('a:nth-child(2)').clone(),
		});
		players.push({
			'pic': td5.find('a:nth-child(4)').clone(),
			'name': td5.find('a:nth-child(5)').clone(),
		});

		players = players.sort(function (a, b) {
			return a.name.text().toLowerCase() < b.name.text().toLowerCase() ? -1 : 1;
		});

		players[0].name.find('span').css("cssText", "color: #6d2233 !important");
		players[1].name.find('span').css("cssText", "color: #6d2233 !important");

		let vs = $('<span />').html('vs').css({'display': 'inline-block', 'padding': '0 15px', 'color': '#787878'});

		my_td_content.append(players[0].pic);
		my_td_content.append(players[0].name);
		my_td_content.append(vs);
		my_td_content.append(players[1].pic);
		my_td_content.append(players[1].name);

		my_td.append(my_td_content);

		my_td.click(function (e) {
			$(my_td).hide();
			console.log(tds);
			tds.show();
		});

		tds.hide();
	});

})();