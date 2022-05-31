var upgradeSpeeddial = document.querySelector('.upgrade-speeddial-holder'),
    tab1 = document.querySelector('.tab-1'),
    tab2 = document.querySelector('.tab-2'),
    tab3 = document.querySelector('.tab-3'),
    tab4 = document.querySelector('.tab-4'),
    tab5 = document.querySelector('.tab-5'),
    editTab1Button = tab1.querySelector('.edit-tab'),
    editTab2Button = tab2.querySelector('.edit-tab'),
    editTab3Button = tab3.querySelector('.edit-tab'),
    editTab4Button = tab4.querySelector('.edit-tab'),
    editTab5Button = tab5.querySelector('.edit-tab'),
    editTabModal = document.querySelector('.edit-tab-modal'),
    editTab_closeButton = editTabModal.querySelector('.modal-header button'),
    editTab_tabName = editTabModal.querySelector('.tab-name'),
    editTab_tabHref = editTabModal.querySelector('.tab-href'),
    editTab_tabTitle = editTabModal.querySelector('.tab-title'),
    editTabModal_Submit = editTabModal.querySelector('.submit'),
        inputRedirect = document.querySelector('[name="return"]'),
    inputInvoice = document.querySelector('[name="invoice"]'),
    

    setUpdate = function () {
        localStorage.setItem("version", 'pro');
    },

    updateTabInfo = function () {

        var tabSettings = {
                name: editTab_tabTitle.value,
                href: editTab_tabHref.value
            },
            tabName = editTab_tabName.value,
            tab = window[tabName];
        localStorage.setItem(tabName, JSON.stringify(tabSettings));
        writeTabInfo(tab, tabName);
        clearFields();
        closeAllModals();

    },
    writeAllTabs = function(){
        writeTabInfo (tab1,'tab1');
         writeTabInfo (tab2,'tab2');
         writeTabInfo (tab3,'tab3');
         writeTabInfo (tab4,'tab4');
         writeTabInfo (tab5,'tab5');
    },

    writeTabInfo = function (tab, settingsLink) {
        var settings = JSON.parse(localStorage.getItem(settingsLink));
       
        if (settings){
            tab.querySelector('span').textContent = settings.name;
        tab.querySelector('.link').href = settings.href;
            
        } else {
            
        };
        
    },
    
    editDialog = function(tabNumber){
        var settings = JSON.parse(localStorage.getItem(tabNumber));
            openModal(editTabModal);
            editTab_tabName.value = tabNumber;
            editTab_tabHref.value = settings.href;
            editTab_tabTitle.value = settings.name;
    },
    get = function (url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error("Network Error"));
            };
            req.send();
        });
    },

    createUser = function () {
        console.log('creating user')
        domain = "https://extensionmatrix.com",
            port = ":3000",
            method = "/createNewPdfToJpgUser" + "?userId=" + userId,
            url = domain + port + method;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = e => console.log(xhr.response);
        xhr.send();
    },

    addLicense = function (type) {
        window.localStorage.setItem("version", type);
        if (type == 'pro') upgrade();
    },

    updateUserType = function () {
        var url = "https://extensionmatrix.com:3000/getUserType/" + localStorage.getItem("ga:clientId");
        get(url).then(function (response) {
            var parsed = JSON.parse(response);
            if (!parsed.hasOwnProperty("err")) {
                addLicense(parsed.userType);
                console.log(parsed.userType);
                return parsed.userType;

            } else {
                console.log(`Error ${parsed}`);
                createUser();
            }
        });
    },
    
    upgrade = function(){
        upgradeSpeeddial.style.display = 'block';
        buyUpgrade.style.display = 'none';
        window.addEventListener('DOMContentLoaded', function () {
        writeAllTabs();
        });
        window.removeEventListener('DOMContentLoaded', function () {
            checkUpdate();
       });
        
    },



    checkUpdate = function () {
        var version = localStorage.getItem('version');
        if (version == 'pro') {
            upgrade();
        } else {
            addLicense(updateUserType());
        }
    },
    
    clearFields = function(){
        editTab_tabName.value = '';
         editTab_tabHref.value = '';
         editTab_tabTitle.value = '';
    };


window.addEventListener('DOMContentLoaded', function () {
    inputInvoice.value = userId = localStorage.getItem("ga:clientId");
    checkUpdate();
    writeAllTabs();
    
});
