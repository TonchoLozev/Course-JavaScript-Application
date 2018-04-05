$(() => {
    renderCatTemplate();
    attachEvents();

    function renderCatTemplate() {
        let cats = window.cats;
        let source = $('#cat-template').html();
        let template = Handlebars.compile(source);
        let context = {
            cat: cats
        };
        let html = template(context);
        $('#allCats').empty();
        $('#allCats').append(html);
    }

    function attachEvents() {
        $('.btn-primary').on('click', function () {

            if ($(this).hasClass('toggled')) {
                $(this).text('Show status code');

                $(this).removeClass('toggled');
                $($(this).parent().children()[1]).css('display', 'none');
            } else {
                $(this).addClass('toggled');
                $(this).text('Hide status code');
                $($(this).parent().children()[1]).css('display', 'inline');
            }
        });
    }
});
