$(() => {
    let data;
    let details;

    async function f() {
        let contacts = await $.get('templates/contacts.hbs');
        let contactTemplate = Handlebars.compile(contacts);

        details = await $.get('templates/details.hbs');

        data = await $.get('data.json');

        let obj = {
            contacts: data
        };

        let tableContacts = contactTemplate(obj);
        $('#list  .content').append(tableContacts);
        attachEvenets();
        console.log(obj)
    }
    f();
    function attachEvenets() {
        $('.contact').on('click', function () {
            loadDetails($(this).data().id);
            $('.active').removeClass('active')
            $(this).addClass('active')
        })
    }
    function loadDetails(id) {
        let detailsTemplate = Handlebars.compile(details);
        let tableDetails = detailsTemplate(data[id]);
        $('#details .content').empty();
        $('#details .content').append(tableDetails);
    }
});