$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        //load home/index page
        this.get('#/index.html', loadHomePage);
        this.get('#/home', loadHomePage);

        //load about page
        this.get('#/about', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/about/about.hbs');
            })
        });

        //load login page
        this.get('#/login', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs');
            });
        });
        //login functionality
        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password).then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('Successfully logged');
                ctx.redirect('#/home')
            }).catch(auth.handleError);
        });

        //load register page
        this.get('#/register', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
        });
        //register functionality
        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPassword;

            auth.register(username, password, repeatPassword).then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('Successfully registered');
                ctx.redirect('#/home');
            }).catch(auth.handleError)
        });

        //logout functionality
        this.get('#/logout', (ctx) => {
            auth.logout().then(function () {
                sessionStorage.clear();
                auth.showInfo('Successfully logged out');
                ctx.redirect('#/home')
            }).catch(auth.handleError);
        });

        //load catalog page
        this.get('#/catalog', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            teamsService.loadTeams().then(function (teams) {
                ctx.teams = teams;
                ctx.hasNoTeam = sessionStorage.getItem('teamId') === null || sessionStorage.getItem('teamId') === "undefined";
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    team: './templates/catalog/team.hbs'
                }).then(function () {
                    this.partial('./templates/catalog/teamCatalog.hbs');
                })
            });
        });

        //create team page
        this.get('#/create', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs')
            })
        });
        //create team functionality
        this.post('#/create', (ctx) => {
            let name = ctx.params.name;
            let comment = ctx.params.comment;

            teamsService.createTeam(name, comment).then(function (teamInfo) {
                let teamId = teamInfo._id;
                teamsService.joinTeam(teamId).then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Team created');
                    ctx.redirect('#/catalog');
                }).catch(auth.handleError);
            }).catch(auth.handleError);
        });

        //team details page
        this.get('#/catalog/:teamId', (ctx) => {
            let teamId = ctx.params.teamId.substr(1);

            teamsService.loadTeamDetails(teamId).then(function (teamInfo) {
                ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
                ctx.username = sessionStorage.getItem('username');
                ctx.name = teamInfo.name;
                ctx.comment = teamInfo.comment;
                ctx.isAuthor = sessionStorage.getItem('userId') === teamInfo._acl.creator;
                ctx.isOnTeam = sessionStorage.getItem('teamId') === teamInfo._id;
                ctx.teamId = teamId;

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    teamControls: './templates/catalog/teamControls.hbs'
                }).then(function () {
                    this.partial('./templates/catalog/details.hbs');
                })
            })
        });

        //join team functionality
        this.get('#/join/:teamId', (ctx)=>{
            let teamId = ctx.params.teamId.substr(1);
            teamsService.joinTeam(teamId).then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('Joined the team');
                ctx.redirect('#/catalog');
            }).catch(auth.handleError);
        });

        //edit team page
        this.get('#/edit/:teamId', (ctx)=>{
            let teamId = ctx.params.teamId.substr(1);
            teamsService.loadTeamDetails(teamId).then(function (teamInfo) {
                ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
                ctx.username = sessionStorage.getItem('username');
                ctx.name = teamInfo.name;
                ctx.comment = teamInfo.comment;
                ctx.teamId = teamId;

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    editForm: './templates/edit/editForm.hbs'
                }).then(function () {
                    this.partial('./templates/edit/editPage.hbs');
                })
            })
        });

        this.post('#/edit/:teamId', (ctx)=>{
            let teamId = ctx.params.teamId.substr(1);
            let name = ctx.params.name;
            let comment = ctx.params.comment;
            teamsService.edit(teamId, name, comment).then(function () {
                auth.showInfo('Team edited');
                ctx.redirect('#/catalog');
            })
        });

        //leave team functionality
        this.get('#/leave', (ctx)=>{
            teamsService.leaveTeam().then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('Team left');
                ctx.redirect('#/catalog');
            });
        });



        function loadHomePage(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.hasTeam = sessionStorage.getItem('teamId') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/home/home.hbs');
            });
        }
    });

    app.run();
});