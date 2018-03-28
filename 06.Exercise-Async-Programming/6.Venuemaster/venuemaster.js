function attachEvents() {

    let username = 'guest';
    let password = 'pass';
    let base64encode = btoa(username + ':' + password);
    let authorization = {"Authorization": "Basic " + base64encode};

    $('#getVenues').on('click', loadData);

    function loadData() {
        let date = $('#venueDate').val();
        $.ajax({
            method: 'POST',
            url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`,
            headers: authorization
        }).then(findVenuse).catch(handleError);

        function findVenuse(res) {
            $('#venue-info').empty();
            for (let idDate of res) {
                $.ajax({
                    method: 'GET',
                    url: `https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/${idDate}`,
                    headers: authorization
                }).then(createElement).catch(handleError);

                function createElement(res) {
                    let buttonInfo = $(`<input class="info" type="button" value="More info">${res.name}`).on('click', showInfo);
                    let buttonPurchase = $(`<td><input class="purchase" type="button" value="Purchase"></td>`).on('click', confirmFunc);
                    let div = $(`<div class="venue" id="${res._id}">`);
                    let span = $(`<span class="venue-name">${res.name}</span>`);
                    span.prepend(buttonInfo);
                    div.append(span).append(
                        $(`<div class="venue-details" style="display: none;">`)
                            .append($(`<table>`)
                                .append(`<tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>`)
                                .append($(`<tr>
                              <td class="venue-price">${res.price} lv</td>
                              <td><select class="quantity">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select></td>`)
                                    .append(buttonPurchase)))
                            .append(`
                                  <span class="head">Venue description:</span>
                                     <p class="description">${res.description}</p>
                                      <p class="description">Starting time: ${res.startingHour}</p>
                                           </div>
                                             </div>`));


                    $('#venue-info').append(div);
                }
                function confirmFunc() {
                    let price = $($(this).parent().children()[0]).text();
                    price = Number(price.substr(0, price.length-2).trim());

                    let quantity = Number($($($(this).parent().children()[1]).children()[0]).find(':selected').text());
                    let name = $($(this).parent().parent().parent().parent().children()[0]).text();
                    let id = $(this).parent().parent().parent().parent().attr('id');
                    $('#venue-info').empty();

                    let btnConfirm = $(`<input type="button" value="Confirm">`).on('click', confirmFunc);

                    let span = $(`<span class="head">Confirm purchase</span>`);
                    let div = $(`<div class="purchase-info">`)
                            .append($(`<span>${name}</span>
                                       <span>${quantity} x ${price}</span>
                                       <span>Total: ${quantity * price} lv</span>`))
                        .append(btnConfirm);

                    $('#venue-info').append(span).append(div);

                    function confirmFunc() {
                       $.ajax({
                           method: 'POST',
                           url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${quantity}`,
                           headers: authorization
                       }).then(appendTicket).catch(handleError);

                        function appendTicket(res) {
                            $('#venue-info').empty();
                            $('#venue-info').append(res.html);
                        }
                    }


                }
                function showInfo() {
                    for (let element of $('#venue-info').children()) {
                        $($(element).children()[1]).css('display', 'none');
                    }
                    $($(this).parent().parent().children()[1]).css('display', 'block');
                }
            }
        }
    }

    function handleError(err) {
        console.log(err);
    }
}