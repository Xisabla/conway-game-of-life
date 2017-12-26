game.dev = {};

game.dev.init = function(form) {
	let input = form.find('input[type=text]');
	input.focus();

	form.submit(function(event) {
		event.preventDefault();

		let command = input.val();
		eval(command);
		setTimeout(game.draw, 100);
		input.val('game.');
	});
};