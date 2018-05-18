const handlers = {};
$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', handlers.homeHandler);
        this.get('#/register', (ctx) => {
            ctx.loadPartials({
                navigation: './templates/common/navigation.hbs',
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/forms/registerForm.hbs')
            });
        });
        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.pass;
            let repeatPass = ctx.params.repeatPass;

            if (password !== repeatPass) {
                alert('Passwords do not mach!')
            } else {
                auth.register(username, password);
                ctx.redirect('#/index.html');
            }

        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.pass;

            auth.login(username, password).then((userData)=>{
                auth.saveSession(userData);
                ctx.redirect('#/index.html');
            }).catch(console.error);
        });
    });
    app.run();
});