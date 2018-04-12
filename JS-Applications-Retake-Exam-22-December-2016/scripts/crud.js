function loadProducts() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/products',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showShop();
        displayProducts(res);
    }).catch(handleError);

    async function displayProducts(products) {
        let table = $('#viewShop tbody');
        //console.log(table)
        table.empty();

        async function f() {
            //format price cuz handlebars cant
            products.map(el => {
                el.price = Number(el.price).toFixed(2)
            });
            let productsTemplate = await $.get('./templates/products.hbs');
            let prodctsCompile = Handlebars.compile(productsTemplate);
            let contextProducts = {
                products: products
            };
            let compileHBStoHtml = prodctsCompile(contextProducts);
            table.append(compileHBStoHtml);
            attachEvents();
        }

        await  f();

        function attachEvents() {
            $('.purchaseBtn').on('click', purchaseProduct);
        }
    }
}

function purchaseProduct() {

    let productId = $(this).parent().parent().data().id;

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/products/' + productId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        addProductToCart(res);
    }).catch(handleError);

    function addProductToCart(product) {
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        }).then(function (res) {
            let user = res;
            let cart;
            console.log(res);
            if (!user.hasOwnProperty('cart')) {
                cart = {};
                cart[product._id] = {
                    quantity: 1,
                    product: {
                        name: product.name,
                        description: product.description,
                        price: Number(product.price).toFixed(2)
                    }
                }
            } else {
                cart = res.cart;
                if (!cart.hasOwnProperty(product._id)) {
                    cart[product._id] = {
                        quantity: 1,
                        product: {
                            name: product.name,
                            description: product.description,
                            price: Number(product.price).toFixed(2)
                        }
                    }
                } else {
                    cart[product._id].quantity = Number(cart[product._id].quantity) + 1;
                }
            }

            $.ajax({
                method: 'PUT',
                url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
                headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
                data: {username: user.username, name: user.name, cart: cart}
            }).then(function () {
                showInfo('Product purchased.')
            }).catch(handleError);
        }).catch(handleError);
    }
}

function loadCart() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        showCart();
        displayProducts(res);
    }).catch(handleError);

    async function displayProducts(res) {

        let products = res.cart;

        let table = $('#viewCart tbody');
        //console.log(table)
        table.empty();

        async function f() {
            let productsTemplate = await $.get('./templates/cart.hbs');
            let prodctsCompile = Handlebars.compile(productsTemplate);

            for (let prod in products) {

                let id = prod;
                let name = products[prod].product.name;
                let description = products[prod].product.description;
                let quantity = Number(products[prod].quantity);
                let price = (quantity * Number(products[prod].product.price)).toFixed(2);

                let contextProducts = {
                    id: id,
                    name: name,
                    description: description,
                    quantity: quantity,
                    price: price
                };
                let compileHBStoHtml = prodctsCompile(contextProducts);
                table.append(compileHBStoHtml);
            }


            attachEvents();
        }

        await  f();

        function attachEvents() {
            $('.discardBtn').on('click', discardProduct);
        }
    }
}

function discardProduct() {
    let productId = $(this).parent().parent().data().id;

    $.ajax({
        method: 'GET',
        url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {

        let user = res;
        let cart = user.cart;
        delete  cart[productId];
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'user/' + APP_KEY + '/' + sessionStorage.getItem('userId'),
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: {username: user.username, name: user.name, cart: cart}
        }).then(function () {
            showInfo('Product discarded.');
            loadCart()
        }).catch(handleError);

    }).catch(handleError);

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