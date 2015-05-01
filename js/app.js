var nwApp = {

	runApp: function(){
		document.getElementById('jsfiddle').onload= function() {
        	var element = document.getElementById('loading');
			element.parentNode.removeChild(element);
    	}
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.showDevTools('jsfiddle');
		win.maximize();
	}

};

nwApp.runApp();