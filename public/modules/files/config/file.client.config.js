'use strict';

// Configuring the Articles module
angular.module('files').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', '파일관리', 'files', 'dropdown', '/files');
		Menus.addSubMenuItem('topbar', 'files', 'List Files', 'files');
	}
]);