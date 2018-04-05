function attachEvents() {
    $('#btnLoadTowns').on('click', loadTowns);
    
    function loadTowns() {
        let arr = $('#towns').val().toString().split(',').map((element, index) => element.trim());
        let source = $('#towns-template').html();
        let template = Handlebars.compile(source);
        let context = {
            town: arr
        };
        let html = template(context);
        $('#root').empty();
        $('#root').append(html);
    }
}