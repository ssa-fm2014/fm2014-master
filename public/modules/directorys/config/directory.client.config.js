'use strict';

// Configuring the Articles module
angular.module('directorys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Directory', 'directorys', 'dropdown', '/directorys');
		Menus.addSubMenuItem('topbar', 'directorys', 'List Directory', 'directorys');
	}
]);