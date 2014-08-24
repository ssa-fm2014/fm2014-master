'use strict';

// Configuring the Articles module
angular.module('directorys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Directory', 'directorys', 'dropdown', '/directorys');
		Menus.addSubMenuItem('topbar', 'directorys', 'Directory List', 'directorys');
		Menus.addSubMenuItem('topbar', 'directorys', 'Directory Info', 'dirinfos');
		Menus.addSubMenuItem('topbar', 'directorys', 'Crontab Info',   'croninfos');
	}
]);