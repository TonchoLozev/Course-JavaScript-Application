$(() => {
    const app = Sammy('#main', function () {
        //USE
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', (ctx) => {
            ctx.swap('<h1>Hello from Sammy</h1>')
        });

        this.get('#/about', (ctx) => {
            ctx.swap('<h1>About Page</h1>')
        });

        this.get('#/contact', (ctx) => {
            ctx.swap('<h1>Contact Page</h1>')
        });

        this.get('#/book/:bookId', (ctx) => {
            let bookId = ctx.params.bookId;
            console.log(ctx.path)
        });

        this.get('#/login', (ctx) => {
            ctx.swap(`
            <form action="#/login" method="post">
                User: <input name="user" type="text"><br>
                Pass: <input name="pass" type="password">
                <input type="submit" value="Login">
            </form>`)});

        this.post('#/login', (ctx)=>{
            console.log(ctx.params.user);
            console.log(ctx.params.pass);
            ctx.redirect('#/contact');
        });

        this.get('#/hello/:name', (ctx)=>{
            ctx.title = 'Hello';
            ctx.name = ctx.params.name;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/greeting.hbs');
            });
        })
    });
    app.run();
});