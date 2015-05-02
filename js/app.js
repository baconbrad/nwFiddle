var nwApp = {

	runApp: function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		$('#jsfiddle').load(function(){
			nwApp.addActions(this, win);
		});
		win.maximize();
	},

	addActions: function(iframe, win){
		var jsFiddle = $(iframe).contents();
		var actions = jsFiddle.find('.actionCont:eq(1)');
		actions.prepend('<li class="actionItem"><a id="nw-open" class="aiButton" href="#nw-open" title="Open Fiddle"><span class="icon-file"></span>Open</a></li>');
		actions.find('#nw-open').on('click', function(){
			nwApp.openAction(jsFiddle);
		});
		actions.append('<li class="actionItem"><a id="nw-sidebar" class="aiButton" href="#nw-sidebar" title="Toggle sidebar"><span class="icon-chevron-left"></span>Sidebar</a></li>');
		actions.find('#nw-sidebar').on('click', function(){
			nwApp.sidebarAction(jsFiddle);
		});
		actions.append('<li class="actionItem"><a id="nw-devtools" class="aiButton" href="#nw-devtools" title="Open dev tools"><span class="icon-cog"></span>Dev Tools</a></li>');
		actions.find('#nw-devtools').on('click', function(){
			nwApp.devtoolsAction(win);
		});
		actions.append('<li class="actionItem"><a id="nw-zen" class="aiButton" href="#nw-zen" title="Zen Mode"><span class="icon-th-large"></span>Zen Mode</a></li>');
		actions.find('#nw-zen').on('click', function(){
			nwApp.zenAction(jsFiddle, win);
		});
		var credits = jsFiddle.find('.ebCont:last');
		credits.append('<p><strong>nwFiddler</strong></p><p>Created and maintained by Brad Metcalf (brad@localabstract.com)<br />Github: baconface</p>');
		$('#loading').fadeOut();
	},

	openAction: function(jsFiddle){
		var dialog = BootstrapDialog.show({
			title: 'Open Fiddle',
			message: '<p>Enter a jsFiddle link you wish to open:</p><input type="text" class="form-control" id="nw-open-input" />',
			buttons: [{
				label: 'Open',
				action: function(dialog) {
					var fiddle = $('#nw-open-input').val();
					if(nwApp.fiddleCheck(fiddle) === true){
						dialog.close();
						$('#loading').fadeIn();
						$('#jsfiddle').attr('src', fiddle).load(function(){
							nwApp.addActions(this, win);
						});
					}
				}
			}, {
				label: 'Cancel',
				action: function(dialog) {
					dialog.close();
				}
			}]
		});
	},

	sidebarAction: function(jsFiddle){
		var sidebar = jsFiddle.find('#sidebar');
		var content = jsFiddle.find('#content');
		var icon = jsFiddle.find('#nw-sidebar span');
		if(icon.attr('class') == 'icon-chevron-left'){
			sidebar.css('opacity', '0');
			content.css('margin', '14px 15px 0 15px');
			icon.attr('class', 'icon-chevron-right');
		} else {
			sidebar.css('opacity', '1');
			content.css('margin', '14px 15px 0 232px');
			icon.attr('class', 'icon-chevron-left');
		}
	},

	devtoolsAction: function(win){
		win.showDevTools('jsfiddle');
	},

	zenAction: function(jsFiddle, win){
		var sidebar = jsFiddle.find('#sidebar');
		var icon = jsFiddle.find('#nw-zen span');
		if(icon.attr('class') == 'icon-th-large'){
			icon.attr('class', 'icon-remove');
			win.enterFullscreen();
		} else {
			icon.attr('class', 'icon-th-large');
			win.leaveFullscreen();
		}
	},

	fiddleCheck: function(url){
		//TODO: Better domain detection than indexOf
		if(url.indexOf("jsfiddle.net") === -1){
			var dialog = BootstrapDialog.show({
				title: 'Invalid Fiddle',
				type: BootstrapDialog.TYPE_DANGER,
				message: 'Please input a working fiddle to continue',
				buttons: [{
					label: 'Cancel',
					action: function(dialog) {
						dialog.close();
					}
				}]
			});
		} else {
			return true;
		}
	}

};

nwApp.runApp();