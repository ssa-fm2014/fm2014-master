'use strict';

// Configuring the Articles module
angular.module('tails').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tails', 'tails', 'dropdown', '/tails');
		Menus.addSubMenuItem('topbar', 'tails', 'List Tails', 'tails');
		Menus.addSubMenuItem('topbar', 'tails', 'Log Main', 'tails/logmain');
		Menus.addSubMenuItem('topbar', 'tails', 'ssh Tail', 'tails/sshTail');
	}
]);