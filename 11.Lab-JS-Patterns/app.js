$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', displayWelcome);
        this.get('#/login', displayWelcome);

        function displayWelcome() {
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function () {
                this.partial('templates/welcome.hbs')
            })
        }

        this.get('#/register', function () {
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function () {
                this.partial('templates/register.hbs')
            })
        });

        this.get('#/contacts', function () {
            this.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
                details: 'templates/common/details.hbs',
                contact: 'templates/common/contact.hbs'
            }).then(function () {
                this.partial('templates/contacts-list.hbs')
            })
        });

        this.get('#/logout', function () {
        });
        this.post('#/login', function () {
            console.log(this.params.username);
            console.log(this.params.password);
        });

        this.post('#/register', function () {
            //Handle register form
        });
    });
    app.run();
});