'use strict';

// Configuring the Articles module
angular.module('prints').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Prints', 'prints', 'dropdown', '/prints');
		Menus.addSubMenuItem('topbar', 'prints', 'Print List', 'prints');
	}
]);