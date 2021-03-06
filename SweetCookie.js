 /*******************************************************************************
 * SweetCookie.js is an edited copy of PrimeBox's jQuery SweetCookie project,	*
 * Copyright (C) 2012 PrimeBox (info@primebox.co.uk).							*
 * all included changes/additions/modifications are for a personal use !		*	
 * check updates in (changelog.txt)												*	
 * This work is licensed to original file owner,								*
 * under the Creative Commons Attribution 3.0 Unported License,					*	
 * To view a copy of this license, 												*
 * visit http://creativecommons.org/licenses/by/3.0/.							*
 *																				*
 * When using this software you use it at your own risk. We hold				*
 * no responsibility for any damage caused by using this plugin					*
 * or the documentation provided.												*
 *																				*	
 * JIHAD SINNAOUR | Viaprestige Web Agency,										*			
 * contact me at j.sinnaour.official@gmail.com,									*
 * find my open-source products in https://github.com/Jakiboy.					*		
 * or visit my website http://jihadsinnaour.ml									*
 *******************************************************************************/
(function($){
	$.SweetCookie = function(options,val){
		if(options=='cookies'){
			var doReturn = 'cookies';
		}else if(options=='set'){
			var doReturn = 'set';
		}else{
			var doReturn = false;
		}
		var defaults = {
			message: 'Nous utilisons des cookies pour suivre l\'utilisation et les préférences.',
			acceptButton: true,
			acceptText: 'Je comprends',
			declineButton: false,
			declineText: 'Désactiver les cookies',
			policyButton: false,
			policyText: 'Privacy Policy',
			policyURL: '',
			autoEnable: true, //Set to true for cookies to be accepted automatically. Banner still shows
			acceptOnContinue: false, //Set to true to silently accept cookies when visitor moves to another page
			expireDays: 30, //Number of days for SweetCookie cookie to be stored for
			forceShow: false, //Force SweetCookie to show regardless of user cookie preference
			effect: 'slide', //Options: slide, fade, hide
			element: 'body', //Element to append/prepend SweetCookie to. Remember "." for class or "#" for id.
			append: false, //Set to true for SweetCookie HTML to be placed at base of website. Actual position may change according to CSS
			CustomCookie: true,
			redirect: String(window.location.href), //Current location
			domain: String(window.location.hostname), //Location of privacy policy
			referrer: String(document.referrer) //Where visitor has come from
		};
		var options = $.extend(defaults,options);
		
		//Sets expiration date for cookie
		var expireDate = new Date();
		expireDate.setTime(expireDate.getTime()+(options.expireDays*24*60*60*1000));
		expireDate = expireDate.toGMTString();
		
		var cookieEntry = 'cb-enabled={value}; expires='+expireDate+'; path=/';
		
		//Retrieves current cookie preference
		var i,cookieValue='',aCookie,aCookies=document.cookie.split('; ');
		for (i=0;i<aCookies.length;i++){
			aCookie = aCookies[i].split('=');
			if(aCookie[0]=='cb-enabled'){
    			cookieValue = aCookie[1];
			}
		}
		//Sets up default cookie preference if not already set
		if(cookieValue=='' && options.autoEnable){
			cookieValue = 'enabled';
			document.cookie = cookieEntry.replace('{value}','enabled');
		}
		if(options.acceptOnContinue){
			if(options.referrer.indexOf(options.domain)>=0 && String(window.location.href).indexOf(options.policyURL)==-1 && doReturn!='cookies' && doReturn!='set' && cookieValue!='accepted' && cookieValue!='declined'){
				doReturn = 'set';
				val = 'accepted';
			}
		}
		if(doReturn=='cookies'){
			//Returns true if cookies are enabled, false otherwise
			if(cookieValue=='enabled' || cookieValue=='accepted'){
				return true;
			}else{
				return false;
			}
		}else if(doReturn=='set' && (val=='accepted' || val=='declined')){
			//Sets value of cookie to 'accepted' or 'declined'
			document.cookie = cookieEntry.replace('{value}',val);
			if(val=='accepted'){
				return true;
			}else{
				return false;
			}
		}else{
			//Sets up enable/accept button if required
			var message = options.message.replace('{policy_url}',options.policyURL);
			
			if(options.acceptButton){
				var acceptButton = '<a href="" class="cb-enable">'+options.acceptText+'</a>';
			}else{
				var acceptButton = '';
			}
			//Sets up disable/decline button if required
			if(options.declineButton){
				var declineButton = '<a href="" class="cb-disable">'+options.declineText+'</a>';
			}else{
				var declineButton = '';
			}
			//Sets up privacy policy button if required
			if(options.policyButton){
				var policyButton = '<a href="'+options.policyURL+'" class="cb-policy">'+options.policyText+'</a>';
			}else{
				var policyButton = '';
			}
			if(options.CustomCookie){
				var CustomCookie = ' class="SweetCookieStyle" ';
			}
			else{
				var CustomCookie = '';
			}
			//Displays the cookie bar if arguments met
			if(options.forceShow || cookieValue=='enabled' || cookieValue==''){
				if(options.append){
					$(options.element).append('<div id="SweetCookie"'+CustomCookie+'><p>'+message+acceptButton+declineButton+policyButton+'</p></div>');
				}else{
					$(options.element).prepend('<div id="SweetCookie"'+CustomCookie+'><p>'+message+acceptButton+declineButton+policyButton+'</p></div>');
				}
			}
			
			//Sets the cookie preference to accepted if enable/accept button pressed
			$('#SweetCookie .cb-enable').click(function(){
				document.cookie = cookieEntry.replace('{value}','accepted');
				if(cookieValue!='enabled' && cookieValue!='accepted'){
					window.location = options.currentLocation;
				}else{
					if(options.effect=='slide'){
						$('#SweetCookie').slideUp(300,function(){$('#SweetCookie').remove();});
					}else if(options.effect=='fade'){
						$('#SweetCookie').fadeOut(300,function(){$('#SweetCookie').remove();});
					}else{
						$('#SweetCookie').hide(0,function(){$('#SweetCookie').remove();});
					}
					return false;
				}
			});
			//Sets the cookie preference to declined if disable/decline button pressed
			$('#SweetCookie .cb-disable').click(function(){
				var deleteDate = new Date();
				deleteDate.setTime(deleteDate.getTime()-(864000000));
				deleteDate = deleteDate.toGMTString();
				aCookies=document.cookie.split('; ');
				for (i=0;i<aCookies.length;i++){
					aCookie = aCookies[i].split('=');
					if(aCookie[0].indexOf('_')>=0){
						document.cookie = aCookie[0]+'=0; expires='+deleteDate+'; domain='+options.domain.replace('www','')+'; path=/';
					}else{
						document.cookie = aCookie[0]+'=0; expires='+deleteDate+'; path=/';
					}
				}
				document.cookie = cookieEntry.replace('{value}','declined');
				if(cookieValue=='enabled' && cookieValue!='accepted'){
					window.location = options.currentLocation;
				}else{
					if(options.effect=='slide'){
						$('#SweetCookie').slideUp(300,function(){$('#SweetCookie').remove();});
					}else if(options.effect=='fade'){
						$('#SweetCookie').fadeOut(300,function(){$('#SweetCookie').remove();});
					}else{
						$('#SweetCookie').hide(0,function(){$('#SweetCookie').remove();});
					}
					return false;
				}
			});
		}
	};
$(document).ready(function(){
$.SweetCookie();
});
})(jQuery);
