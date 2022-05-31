
(function () {

  const api = 'https://api.zillstr.com/'; // 'https://dev-api.zillstr.com/';

  let config;
  let favoritesInfo;


  const init = () => {
    getConfigs().then(json => {
      config = json;
      initURLChangeObserver(function () {
        processURL();
      });
      processURL();
    });
  };


  const initURLChangeObserver = (() => {
    let url = document.location.href;
    return (onChange) => {
      setInterval(() => {
        if (document.location.href !== url) {
          url = document.location.href;
          onChange();
        }
      }, 1000);
    };
  })();


  const processURL = () => {
    let href = document.location.href;
    let isItemPage = href.match(/favorites#\d+/) || href.match(/\/homedetails\//);
    if (isItemPage) {
      waitForPageLoaded(function () {
        initPriceChangeListener(processHomePage);
        processHomePage();
      });
    }
    else if (document.location.href.indexOf('/favorites') !== -1) {
      setTimeout(function(){
        getFavoritesInfo().then(json => {
          favoritesInfo = json;
          processFavorites();
        }).catch(e => {
          console.log(e);
        });
      }, 2000);
    }
  };

   // get selectors from API
   const getConfigs = () => {
    return new Promise((resolve, reject) => {
      let requestSender = new XMLHttpRequest();
      requestSender.onreadystatechange = function (response) {
        if (requestSender.readyState === 4 && requestSender.status === 200) {
          const configsRs = JSON.parse(requestSender.responseText);
          resolve(configsRs);
        }
      };
      requestSender.open('GET', api + 'configs', true);
      requestSender.send();
    });
  };

  const waitForPageLoaded = onReady => {
    let timer = setInterval(function () {
      let selector = config.buttonGroup.Button_Options;
      let buttons = document.querySelectorAll(selector);
      if (buttons.length === 2 || (buttons.length === 1 && buttons[0].textContent.indexOf(config.buttonGroup.Button_TextContent) !== -1)) {
        clearInterval(timer);
        onReady();
      }
    }, 100);
  };

  const processHomePage = async () => {
    let url = document.location.href;
    if (url.indexOf('favorites#') !== -1) {
      let matches = url.match(/favorites#(\d+)/);
      url = `https://www.zillow.com/homedetails/${matches[1]}_zpid/`;
    }
    let response = await fetch(url);
    let html = await response.text();
    let parser = new DOMParser();
    let dom = parser.parseFromString(html, 'text/html');
    var info = getListingInfo(dom);
    console.log(info);
    if (!info.price || !info.zipCode) {
      console.log('No listing information. Abort.');
      return;
    }
    var root = getRoot(info);
    var summaryRoot = document.querySelector('.summary-container, .ds-chip');
    runAIRDNAEstimate(info, root, summaryRoot);
  };


  const initPriceChangeListener = (() => {
    let downPaymentInput;
    let downPaymentValue;
    let priceValue;
    return (onChange) => {
      setInterval(function () {
        let input = document.querySelector('#down-payment');
        if (input) {
          let value = getDownPayment(input);
          if (input !== downPaymentInput) {
            input.addEventListener("change", function () {
              console.log('Down payment change', this.value);
              if (onChange) onChange();
            });
          }
          if (downPaymentValue && downPaymentValue !== value) {
            onChange();
          }
          downPaymentInput = input;
          downPaymentValue = value;
        }
        let price = getMonthlyCost();
        if (priceValue && price !== priceValue) {
          if (onChange) onChange();
        }
        priceValue = price;
      }, 1000);
    };
  })();


  const getMonthlyCost = () => {
    let monthlyCostNode = document.querySelector('#Monthly-cost, #skip-link-monthly-costs');
    if (monthlyCostNode) {
      let text = monthlyCostNode.nextElementSibling.textContent;
      let priceMatch = text.match(/Estimated monthly cost\$([\d,]+)/);
      let price;
      if (priceMatch) price = parseFloat(priceMatch[1].replace(/[^0-9.-]+/g, ''));
      return price;
    }
  };


  const getFavoritesInfo = () => {
    let userId = getUserId(document);
    if (userId) userId = userId.keystoneData._zuid;
    return new Promise(function(resolve, reject){
      chrome.runtime.sendMessage({
        cmd: 'ajax.get',
        data: {url: API + `favorites/${userId}`}
      }, function(res){
        let json = JSON.parse(res);
        resolve(json);
      });
    });
  };


  const processFavorites = () => {
    let items = document.querySelectorAll('.list-card');
    Array.from(items).map(function (item) {
      processFavoriteItem(item);
    });
    setTimeout(processFavorites, 1000);
  };


  const processFavoriteItem = async (node) => {
    if (node.querySelector('.extension-summary') || node.querySelector('.extension-spinner')) return;
    let a = node.querySelector('.list-card-info a');
    let href = a.href;
    let listingId = (href.match(/(\d+)_zpid/) || [])[1];
    let data = getCalculationByListingId(listingId);
    console.log(listingId, data);
    renderFavoritesData(node, data);
    // let response = await fetch(a.href);
    // let html = await response.text();
    // let parser = new DOMParser();
    // let dom = parser.parseFromString(html, 'text/html');
    // let info = getListingInfo(dom);
    // runAIRDNAEstimate(info, node, node);
  };


  const getCalculationByListingId = listingId => {
    if (!favoritesInfo) return;
    console.log(favoritesInfo);
    return favoritesInfo.filter(function(item){
      return item.listingId === listingId;
    })[0];
  };


  const renderFavoritesData = (node, info) => {
    let summary = node.querySelector('.extension-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'extension-summary';
      node.appendChild(summary);
    }
    if (!info) summary.innerHTML = 'Not available';
    else {
      summary.innerHTML = `<div>
        <span class="summary-item">
          <span class="summary-title">Average Daily Rate: </span><span class="summary-value">$${info.adr}</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Average Occupancy: </span><span class="summary-value">${info.occupancy}%</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Estimated Revenue: </span><span class="summary-value">$${info.revenue.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Total Expenses: </span><span class="summary-value">$${info.totalExpenses.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Cash Flow: </span><span class="summary-value">$${info.cashFlow.annual.toLocaleString()}/yr</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Initial Investment: </span><span class="summary-value">$${info.downpayment.toLocaleString()}</span>
        </span>
        <span class="summary-item">
          <span class="summary-title">Cash on Cash: </span><span class="summary-value">${info.cashOnCash}%</span>
        </span>
      </div>`;
    }
  };


  const getListingInfo = (dom) => {
    if (!dom) dom = document;
    let info = {};
    let listingJSON = getListingJSON(dom);
    console.log(listingJSON);

    let userIdJSON = getUserId(dom);
    // Get listing price from JSON object
    // <meta property="product:price:amount" content="295000.00">
    let priceNode = dom.querySelector("meta[property='product:price:amount']");
    let price;
    if (priceNode) {
      info.price = priceNode.getAttribute("Content");
    }
    // Output price
    console.log('Price: ' + info.price);

    if (listingJSON) {
      info.listingId = listingJSON.zpid;
      info.zipCode = listingJSON.zipcode;
      info.lat = listingJSON.latitude;
      info.long = listingJSON.longitude;
    }

    if (userIdJSON) {
      info.userId = userIdJSON.keystoneData._zuid;
    }

    console.log("User ID: " + info.userId);

    // Extract down payment
    // for the home details page take if from page because user
    // can change it
    let downPaymentInput = dom.querySelector('#down-payment');
    if (document.location.href.indexOf('/homedetails/') !== -1) {
      downPaymentInput = document.querySelector('#down-payment');
    }
    if (downPaymentInput) info.downPayment = getDownPayment(downPaymentInput);
    else info.downPayment = info.price * 0.20;
    console.log(downPaymentInput);
    console.log('Down Payment: ' + info.downPayment);

    info.aExpenses = getAnnualExpenses(dom);

    // Get beds
    info.beds = dom.querySelector('meta[property="zillow_fb:beds"]').content;
    console.log('Beds: ' + info.beds);

    // Get beds
    info.baths = dom.querySelector('meta[property="zillow_fb:baths"]').content;
    console.log('Baths: ' + info.baths);

    // Get URL
    info.url = document.location.href;
    console.log('URL: ' + info.url);

    return info;
  };


  const getDownPayment = input => {
    let value = 0;
    if (input) value = parseFloat(input.value.replace(/[^0-9.-]+/g, ''));
    if (isNaN(value)) value = 0;
    return value;
  };


  const getAnnualExpenses = dom => {
    let res;
    try {
      let section = dom.querySelector('#Monthly-cost, #skip-link-monthly-costs').parentNode;
      let h5 = section.querySelectorAll('h5');
      let cost = '';
      Array.from(h5).map(function (node) {
        if (node.parentNode.textContent.indexOf('Estimated monthly cost') !== -1) {
          cost = node.textContent;
        }
      });
      res = cost;
    } catch (e) {
      console.log(e);
      res = '';
    }
    let aExpenses = Number(res.replace(/[^0-9.-]+/g, ""));
    // the website always send the 1438 as monthly expenses and
    // then page load actual value. So get the value from the page
    let monthly = getMonthlyCost();
    aExpenses = monthly;
    console.log('Monthly Expenses: ' + aExpenses);
    return aExpenses;
  };


  const getListingJSON = dom => {
    try {
      let cache = JSON.parse(JSON.parse(dom.querySelector('#hdpApolloPreloadedData').textContent).apiCache);
      let res;
      for (var key in cache) {
        if (key.indexOf('Variant') === 0) {
          res = cache[key].property;
        }
      }
      return res;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  const getUserId = dom => {
    try {
      let uId = JSON.parse(dom.querySelector('#hdp-svc-config').textContent);
      console.log(uId);
      return uId;
    } catch (e) {
      console.log(e);
      return '';
    }
  };



  // Email #data-view-email
  // Name #data-view-name


  function runAIRDNAEstimate(info, root, summaryRoot) {
    var chipNode = summaryRoot.querySelector('.ds-home-details-chip, .list-card-info .list-card-footer');
    // if (!chipNode) chipNode = root;
    toggleSpinner(chipNode, true);
    // make call to airdna via AWS API
    var url = api + 'calculate';

    var aExpensesTotal = info.aExpenses;
    aExpensesTotal += getSTRCostsTotal();

    var params =
      "userId=" + info.userId +
      "&listingId=" + info.listingId +
      "&accommodates=4" +
      "&bedrooms=" + info.beds +
      "&bathrooms=" + info.baths;
    if (info.zipCode) {
      params += "&zipcode=" + info.zipCode +
      "&lat=" + 0 + // + info.lat +
      "&lng=" + 0 + // + info.long +
      "&propertyExpenses=" + aExpensesTotal +
      "&downpayment=" + info.downPayment +
      "&maintenance=" + 2 +
      "&bookingFees=" + 2 +
      "&supplies=" + 2 +
      "&capexRate=" + 2 +
      "&managementFees=" + 2 +
      "&other=" + 2 +
      "&url=" + encodeURIComponent(info.url)
      ;
    }
    else {
      params += "&zipcode=&lat=&lng=";
    }

    chrome.runtime.sendMessage({
      cmd: 'ajax.get',
      data: {url: url + "?" + params}
    }, function(res){
      console.log(res);
      apiHandler({
        response: res,
        info: info,
        root: root,
        summaryRoot: summaryRoot
      });
    });
  }


  const getRoot = (info) => {
    let node = document.querySelector('#extension-overlay');
    if (node) return node;
    node = document.createElement('div');
    node.id = 'extension-overlay';
    node.style.display = 'none';
    document.body.appendChild(node);
    node.innerHTML = `
      <div class="extension-close">×</div>
      <div class="extension-spinner" style="display:none">
        <img src="${chrome.extension.getURL('images/spinner16.gif')}">
      </div>
      <div class="extension-info"></div>
      <div class="extension-inputs">${addSTRCostsInputs(info.aExpenses)}</div>
    `;
    node.querySelector('.extension-close').addEventListener('click', function(e){
      node.style.display = 'none';
    });
    let inputs = node.querySelectorAll('input');
    for (var i = 0, len = inputs.length; i < len; i++) {
      var input = inputs[i];
      input.addEventListener('change', function(){
        let val = this.value;
        let siblingInput;
        let siblingValue;
        if (this.id.indexOf('percent') !== -1) {
          siblingInput = this.parentNode.parentNode.querySelector('#' + this.id.replace('-percent', ''));
          siblingValue = info.aExpenses * val / 100;
        }
        else {
          siblingInput = this.parentNode.parentNode.querySelector('#' + this.id + '-percent');
          siblingValue = (val/info.aExpenses) * 100;
        }
        siblingInput.value = siblingValue;
        getSTRCostsTotal();
        processHomePage();
      });
    }
    getSTRCostsTotal();
    return node;
  };


  function apiHandler({ response, info, root, summaryRoot }) {
    let calculateRs = JSON.parse(response);
    console.log(calculateRs);
    info.adr = calculateRs.adr;
    info.occ = Math.round(calculateRs.occupancy * 100);
    info.acc = calculateRs.accommodates;
    info.dp = calculateRs.downpayment;
    info.revM = calculateRs.revenue.monthly;
    info.revA = calculateRs.revenue.annual;
    info.peM = calculateRs.property_expenses.monthly;
    info.peA = calculateRs.property_expenses.annual;
    info.maintM = calculateRs.str_expenses.maintenance.monthly;
    info.maintA = calculateRs.str_expenses.maintenance.annual;
    info.bookfeesM = calculateRs.str_expenses.bookingFees.monthly;
    info.bookfeesA = calculateRs.str_expenses.bookingFees.annual;
    info.suppliesM = calculateRs.str_expenses.supplies.monthly;
    info.suppliesA = calculateRs.str_expenses.supplies.annual;
    info.capRateM = calculateRs.str_expenses.capexRate.monthly;
    info.capRateA = calculateRs.str_expenses.capexRate.annual;
    info.managefeesM = calculateRs.str_expenses.managementFees.monthly;
    info.managefeesA = calculateRs.str_expenses.managementFees.annual;
    info.othM = calculateRs.str_expenses.other.monthly;
    info.othA = calculateRs.str_expenses.other.annual;
    info.strexpM = calculateRs.str_expenses.str_expenses_total.monthly;
    info.strexpA = calculateRs.str_expenses.str_expenses_total.annual;
    info.totexpM = calculateRs.total_expenses.monthly;
    info.totexpA = calculateRs.total_expenses.annual;
    info.cashFlowM = calculateRs.cashflow.monthly;
    info.cashFlowA = calculateRs.cashflow.annual;
    info.coc = (calculateRs.cash_on_cash);
    console.log(info);

    toggleSpinner(root, false);

    let wrapper = root.querySelector('.extension-info');
    if (!wrapper) return;
    wrapper.innerHTML = renderInfo(info);

    var chipNode = summaryRoot.querySelector('.ds-home-details-chip, .list-card-info .list-card-footer');

    toggleSpinner(chipNode, false);
    let summary = summaryRoot.querySelector('.extension-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'extension-summary';
      chipNode.appendChild(summary);
    }
    summary.innerHTML = `<div id="str-est" class="str-estimate">
      <span class="cashflow-title">Est. Cash Flow:  </span>
      <a class="cashflow-value">$${info.cashFlowA.toLocaleString()}/yr</a>
    </div>`;
    summary.querySelector('.cashflow-value').addEventListener('click', function(e){
      toggleWidget(root);
    });
  }


  const renderInfo = info => {
    html = `
    <span tabindex="-1" id="str-data-view"></span>
    <div class="str-analysis-tab">
      <div class="ds-expandable-card-section-default-padding">
        <div class="ds-expandable-card">
          <h5 class="Text-str-heading">STR Analysis</h5>
          <div class="str-sub-title">
            <span class="Text-str-sub-title">Estimated STR Forecast</span>
          </div>
        </div>

        <div id="str" class="str-deal-analysis">
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Average Daily Rate</span>
                <span class="Text-str-data-row-item-value">$${info.adr.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Average Occupancy</span>
                <span class="Text-str-data-row-item-value">${info.occ}%</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Estimated Revenue</span>
                <span class="Text-str-data-row-item-value">$${info.revA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Total Expenses</span>
                <span class="Text-str-data-row-item-value">$${info.totexpA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Cash Flow</span>
                <span class="Text-str-data-row-item-value">$${info.cashFlowA.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Initial Investment</span>
                <span class="Text-str-data-row-item-value">$${info.downPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="str-data-row">
            <div class="str-data-row-container">
              <div class="str-data-row-item">
                <span class="Text-str-data-row-item-title">Cash on Cash</span>
                <span class="Text-str-data-row-item-value">${info.coc}%</span>
              </div>
            </div>
        </div>
      </div>
    </div>`;
    return html;
  };


  const getSTRCostsTotal = () => {
    let inputs = document.querySelectorAll('#str-costs-root input');
    let sum = 0;
    for (var i = 0, len = inputs.length; i < len; i++) {
      var input = inputs[i];
      if (input.id.indexOf('percent') !== -1) continue;
      let val = parseFloat(input.value);
      if (val) sum += val;
    }
    let total = document.querySelector('#str-costs-total');
    console.log(sum, total);
    if (total) total.textContent = sum.toFixed(2);
    return sum;
  };


  const addSTRCostsInputs = (aExpenses) => {
    let percent = 2;
    let value = aExpenses * percent / 100;
    let html = `<div id="str-costs-root">
      <div class="ds-expandable-card-section-default-padding">
        <div class="ds-expandable-card">
          <div class="str-sub-title">
            <span class="Text-str-sub-title">Estimate STR Expenses</span>
          </div>
          <div id="str-costs-total-wrap">Total: <span id="str-costs-total"></span></div>
        </div>
        <div class="str-costs-inputs">`;
    'Maintenance,Booking Fees,Supplies,CapEx Rate,Management Fees,Other'.split(',').map(function(name){
      let id = name.toLowerCase().replace(' ', '_');
      html += `
        <div class="str-data-row">
          <label>${name}</label>
          <div class="str-data-row-input">
            <span class="input-dollar-label">$</span>
            <input id="${id}" class="input-value" type="text" value="${value}">
            <input id="${id}-percent" class="input-percent" type="text" value="${percent}">
            <span class="input-percent-label">%</span>
          </div>
        </div>
      `;
    });
    html += '</div></div></div>';
    return html;
  };


  const toggleWidget = (root, show) => {
    if (typeof show === 'undefined') {
      if (root.style.display === 'none') show = true;
      else show = false;
    }
    if (show) {
      root.style.display = 'block';
    }
    else {
      root.style.display = 'none';
    }
  };


  const toggleSpinner = (root, show) => {
    var node = root.querySelector('.extension-spinner');
    if (!node) {
      node = document.createElement('div');
      node.className = 'extension-spinner';
      node.innerHTML = `<img src="${chrome.extension.getURL('images/spinner16.gif')}">`;
      if (root) {
        root.appendChild(node);
      }
      // root.style.height = 'auto';
    }
    if (show) {
      node.style.display = 'block';
    }
    else {
      node.style.display = 'none';
    }
  };


  return {
    init: init
  };

})().init();
