// original file:/media/data2/jianjia/extension_data/unzipped_extensions/jegpdblpefhmbmijgbdpaleebllimpke/background.js


(function(){
    function timeString(d) {
        
        var curr_day, curr_date, curr_month, curr_year, hours, minutes, seconds, meri,
            d_names, m_names, sDate, ln, i;
    
        curr_day = d.getDay();
        curr_date = d.getDate();
        curr_month = d.getMonth();
        curr_year = d.getFullYear();
        hours = d.getHours();
    
        if (hours >= 12) {
            hours -= 12;
            meri = "pm";
        } else {
            meri = "am";
        }
        if (hours === 0) {
            hours = 12;
        }
    
        minutes = d.getMinutes();
        if (String(minutes).length === 1) {
            minutes = "0" + String(minutes);
        }
    
        seconds = d.getSeconds();
        if (String(seconds).length === 1) {
            seconds = "0" + String(seconds);
        }
    
        d_names = [chrome.i18n.getMessage("Sunday"), chrome.i18n.getMessage("Monday"), chrome.i18n.getMessage("Tuesday"), chrome.i18n.getMessage("Wednesday"), chrome.i18n.getMessage("Thursday"), chrome.i18n.getMessage("Friday"), chrome.i18n.getMessage("Saturday")];
        m_names = [chrome.i18n.getMessage("January"), chrome.i18n.getMessage("February"), chrome.i18n.getMessage("March"), chrome.i18n.getMessage("April"), chrome.i18n.getMessage("May"), chrome.i18n.getMessage("June"), chrome.i18n.getMessage("July"), chrome.i18n.getMessage("August"), chrome.i18n.getMessage("September"), chrome.i18n.getMessage("October"), chrome.i18n.getMessage("November"), chrome.i18n.getMessage("December")];
    
        //Loop through each item in the format to build the string
        sDate = "";
        ln = fmt.length;
        for (i = 0; i < ln; i++) {
            //Original characters
            //t=12 T=24 a=am D=wordDay d=noDay e=2digitDay s=/ M=wordMonth m=noMonth y=yy Y=yyyy
            //Additional characters now permitted
            //j (same as d), l (same as D), S (st, nd, rd or th)
            //J (first three characters of day)
            //N (first three characters of month)
            //n (same as m)
            //A (AM/PM)
            //g (12h hour, no leading zero), G (24h hour, no leading zero),
            //h (12h hour, leading zero), H (24h hour, leading zero), i (minute, leading zero)
            //x (seconds, leading zero)
            //\ (ignore next character)
            //Anything else, show as is
            switch (fmt.charAt(i)) {
            case "\\":
          i++;
          sDate += fmt.charAt(i);
          break;
            case "S":
                switch (parseInt(curr_date,10) % 10) {
                    case 1:
                        if (curr_date === 11) {
                            sDate += "th";
                        } else {
                            sDate += "st";
                        }
                        break;
                    case 2:
                        if (curr_date === 12) {
                            sDate += "th";
                        } else {
                            sDate += "nd";
                        }
                        break;
                    case 3:
                        if (curr_date === 13) {
                            sDate += "th";
                        } else {
                            sDate += "rd";
                        }
                        break;
                    default:
                        sDate += "th";
                }
                break;
            case "t":
                sDate += hours + ":" + minutes;
                break;
            case "g":
                sDate += hours;
                break;
            case "h":
                if (String(hours).length < 2) {
                    sDate += "0";
                }
                sDate += hours;
                break;
            case "i":
                sDate += minutes;
                break;
            case "x":
                sDate += seconds;
                break;
            case "H":
                if (String(d.getHours()).length < 2) {
                    sDate += "0";
                }
                sDate += d.getHours();
                break;
            case "G":
                sDate += d.getHours();
                break;
            case "T":
                if (String(d.getHours()).length < 2) {
                    sDate += "0";
                }
                sDate += d.getHours() + ":" + minutes;
                break;
            case "a":
                sDate += meri;
                break;
            case "A":
                sDate += meri.toUpperCase();
                break;
            case "s":
                sDate += "/";
                break;
            case "l":
            case "D":
                sDate += d_names[curr_day];
                break;
            case "J":
              sDate += d_names[curr_day].substring(0, 3);
              break;
            case "j":
            case "d":
                sDate += curr_date;
                break;
            case "e":
                if (String(curr_date).length < 2) {
                    sDate += "0";
                }
                sDate += curr_date;
                break;
            case "M":
                sDate += m_names[curr_month];
                break;
            case "N":
              sDate += m_names[curr_month].substring(0,3);
                break;
            case "n":
            case "m":
                if (String(curr_month + 1).length < 2) {
                    sDate += "0";
                }
                sDate += (curr_month + 1);
                break;
            case "Y":
                sDate += curr_year;
                break;
            case "y":
                sDate += String(curr_year).substr(2);
                break;
            default:
                sDate += fmt.charAt(i);
                break;
            }
        }
        return sDate;
    }    
    
    
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
    {
        switch (msg.action)
        {
            case 'wp':
            var tabId = sender.tab.id;
            var url = msg.site_url;
            chrome.browserAction.enable(tabId);

				return true;

            case 'nowp':
            chrome.browserAction.disable(tabId);

        return true;
            case '':
            chrome.browserAction.disable(tabId);

            return true;
            default:
            break;
        }


    });


})();


chrome.browserAction.setTitle({

    title: " Chrome Toolbar Super Clock \n   by * City-Timezones.com *"
    });

