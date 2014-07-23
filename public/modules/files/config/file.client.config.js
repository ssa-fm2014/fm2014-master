'use strict';

// Configuring the Articles module
angular.module('directorys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Files', 'directorys', 'dropdown', '/files');
		Menus.addSubMenuItem('topbar', 'directorys', 'List Files', 'files');
	}
]);