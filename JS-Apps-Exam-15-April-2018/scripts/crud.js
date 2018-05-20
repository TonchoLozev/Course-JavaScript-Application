function loadHome() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/receipts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showHomeView();
        findReceipt(res);
    }).catch(handleError)
}

function findReceipt(receipts) {
    let activeReceipt;
    for (let receipt of receipts) {
        if (receipt.active === "true" && receipt._acl.creator === sessionStorage.getItem('userId')) {
            activeReceipt = receipt;
            break;
        }
    }
    if (activeReceipt !== undefined) {
        loadReceipt(activeReceipt);
    } else {
        createReceipt();
    }
}

function loadReceipt(receipt) {
    let activeReceipt = receipt;

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/products',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        loadProducts(res, activeReceipt);
    }).catch(handleError);

    async function loadProducts(products, receipt) {
        let productsToLoad = [];
        for (let product of products) {
            if (product.receiptId === receipt._id) {
                productsToLoad.push(product);
            }
        }
        let table = $('#create-receipt-view');
        table.empty();

        async function f() {
            let sum = 0;
            let productCount = 0;
            productsToLoad.forEach(el => {
                el.totalPrice = (Number(el.price) * Number(el.qty)).toFixed(2);
                sum += Number(el.totalPrice);
                productCount++;
            });
            sum = sum.toFixed(2);
            let productsTemplate = await $.get('./templates/receiptProducts.hbs');
            let protuctsCompile = Handlebars.compile(productsTemplate);

            let contextProducts = {
                receiptId: receipt._id,
                products: productsToLoad,
                sum: sum
            };
            let compileHBStoHtml = protuctsCompile(contextProducts);
            table.append(compileHBStoHtml);
            attachEvents(receipt, productCount, sum);
        }

        await f();

        function attachEvents(receipt, productCount, sum) {
            $('#addItemBtn').on('click', addProductToReceipt);
            $('#receiptId').val(receipt._id);
            $('#productCount').val(productCount);
            $('#totalSum').val(sum);
            $('.btnDelete').on('click', deleteProductFromReceipt);
            $('#checkoutBtn').on('click', checkOutReciept);
        }
    }
}

function deleteProductFromReceipt(event) {
    event.preventDefault();
    let productIdToDelete = $(this).parent().parent().data().id;

    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/products/' + productIdToDelete,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function () {
        showInfo('Entry removed.');
        loadHome();
    }).catch(handleError);
}

function createReceipt() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/receipts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {total: 0, productsCount: 0, active: true}
    }).then(function (res) {
        loadHome();
    }).catch(handleError)
}

function addProductToReceipt(event) {
    event.preventDefault();
    let receiptId = $('#receiptId').val();
    let type = $('#create-entry-form input[name=type]');
    let qty = $('#create-entry-form input[name=qty]');
    let price = $('#create-entry-form input[name=price]');
    if (type.val().length === 0 || isNaN(Number(qty.val())) || isNaN(Number(price.val())) || qty.val().length === 0 || price.val().length === 0) {
        let err = {responseJSON: {description: 'Invalid credentials. Please retry your request with correct credentials'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/products',
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {receiptId: receiptId, price: price.val(), qty: qty.val(), type: type.val()}
        }).then(function (res) {
            type.val('');
            qty.val('');
            price.val('');
            showInfo('Entry added.');
            loadHome();
        }).catch(handleError);
    }
}

function checkOutReciept(event) {

    event.preventDefault();

    let total = $('#totalSum').val();
    let productsCount = $('#productCount').val();
    let receiptId = $('#receiptId').val();

    if ($('#active-entries').children().length === 0) {
        let err = {responseJSON: {description: 'Not enough entries.'}};
        handleError(err);
    } else {
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/receipts/' + receiptId,
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {
                total: total,
                productsCount: productsCount,
                active: "false"
            }
        }).then(function () {
            showInfo('Receipt checked out.');
            loadHome();
        }).catch(handleError);
    }
}

function loadAllReceipts() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/receipts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showAllReceipts();
        loadUserReceipts(res);
    }).catch(handleError);

    async function loadUserReceipts(receipts) {
        let receiptsToShow = [];
        for (let receipt of receipts) {
            if (receipt._acl.creator === sessionStorage.getItem('userId') && receipt.active === 'false') {
                receiptsToShow.push(receipt);
            }
        }

        async function f() {
            let sum = 0;
            let tableRows = $('.table > .row');
            tableRows.empty();
            let tableFoot = $('.table > .table-foot');
            tableFoot.empty();

            let tableToAppend = $('#all-receipt-view > .table');
            receiptsToShow.forEach(el => {
                el.date = format(new Date(el._kmd.ect), 'yyyy-MM-dd hh:mm');
                sum += Number(el.total);
            });
            let receiptsTemplate = await $.get('./templates/allReceipts.hbs');
            let receiptsCompile = Handlebars.compile(receiptsTemplate);
            let contextProducts = {
                receipts: receiptsToShow,
                total: sum
            };

            let compileHBStoHtml = receiptsCompile(contextProducts);
            tableToAppend.append(compileHBStoHtml);
            attachEvents();
        }

        await f();

        function attachEvents() {
            $('.detailsBtn').on('click', loadDetails)
        }
    }
}

function loadDetails(event) {
    event.preventDefault();
    let receiptId = $(this).parent().parent().data().id;
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/products',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showReceiptDetails();
        loadReceiptDetails(res, receiptId);
    }).catch(handleError)
}

async function loadReceiptDetails(products, receiptId) {

    let productsToLoad = [];

    for (let product of products) {
        if (product.receiptId === receiptId) {
            productsToLoad.push(product);
        }
    }

    async function f() {
        let table = $('#receipt-details-view > .table');
        let tableRows =  $('#receipt-details-view > .table > .row');
        tableRows.empty();
        productsToLoad.forEach(el => {
            el.totalPrice = (Number(el.price) * Number(el.qty)).toFixed(2);
        });

        let productsTempalte = await $.get('./templates/productsDetails.hbs');
        let productsCompile = Handlebars.compile(productsTempalte);
        let contextProducts = {
            products: productsToLoad,
        };

        let compileHBStoHtml = productsCompile(contextProducts);
        table.append(compileHBStoHtml);
    }

    await f();

}

function handleError(err) {
    let errorMsg = JSON.stringify(err);
    if (err.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if (err.responseJSON && err.responseJSON.description) {
        errorMsg = err.responseJSON.description;
    }
    showError(errorMsg);
}