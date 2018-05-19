$(() => {
    const app = Sammy('#main', function () {

        this.use('Handlebars', 'hbs');

        //default/home page view
        this.get('#/home', loadHome);
        this.get('#/index.html', loadHome);

        this.get('#/about', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/about/about.hbs')
            });
        });

        //login page view
        this.get('#/login', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs')
            });
        });

        //login account=
        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            console.log(username, password);

            auth.login(username, password).then(function (user) {
                auth.saveSession(user);
                auth.showInfo('Logged in');
                ctx.redirect('#/home');
            }).catch(auth.handleError)

        });

        //logout logic

        this.get('#/logout', (ctx) => {
            auth.logout().then(function () {
                sessionStorage.clear();
                auth.showInfo('Logged out');
                ctx.redirect('#/home');
            }).catch(auth.handleError);
        });

        //register page view
        this.get('#/register', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs')
            });
        });

        //register account=
        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPassword;
            if (password !== repeatPassword) {
                auth.showError('Passwords do not mach!');
            } else {
                auth.register(username, password, repeatPassword).then(function (user) {
                    auth.saveSession(user);
                    auth.showInfo('Registered');
                    ctx.redirect('#/home');
                }).catch(auth.handleError)
            }

        });

        //catalog page view
        this.get('#/catalog', displayCatalog);

        //create team page view
        this.get('#/create', (ctx) => {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs')
            });
        });

        //create team
        this.post('#/create', (ctx) => {
            let teamName = ctx.params.name;
            let comment = ctx.params.comment;

            teamsService.createTeam(teamName, comment).then(function (team) {
                console.log(team);
                let id = team._id;
                teamsService.joinTeam(id).then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Team created');
                    ctx.redirect('#/catalog');
                }).catch(auth.handleError);
            }).catch(auth.handleError);
        });

        //team details page
        this.get('#/catalog/:id', (ctx) => {
            let id = ctx.params.id.substr(1);

            teamsService.loadTeamDetails(id).then(function (teamInfo) {
                ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
                ctx.username = sessionStorage.getItem('username');
                ctx.comment = teamInfo.comment;
                ctx.name = teamInfo.name;
                ctx.isOnTeam = teamInfo._id === sessionStorage.getItem('teamId');
                ctx.teamId = id;
                ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem('userId');

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    teamControls: './templates/catalog/teamControls.hbs'
                }).then(function () {
                    this.partial('./templates/catalog/details.hbs')
                });
            });
        });

        //join team
        this.get('#/join/:id', (ctx) => {
            let id = ctx.params.id.substr(1);

            teamsService.joinTeam(id).then(function (userInfo) {
                auth.saveSession(userInfo);
                auth.showInfo('Joined in the team');
                ctx.redirect('#/catalog');
            });
        });

        //leave team
        this.get('#/leave', (ctx) => {
            teamsService.leaveTeam().then(function (userInfo) {
                auth.showInfo('You left the team');
                auth.saveSession(userInfo);
                ctx.redirect('#/catalog');
            }).catch(auth.handleError);
        });

        //edit page view
        this.get('#/edit/:id', (ctx)=>{
            let id = ctx.params.id.substr(1);
            teamsService.loadTeamDetails(id).then(function (teamInfo) {
                ctx.teamId = id;
                ctx.name = teamInfo.name;
                ctx.comment = teamInfo.comment;
                ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
                ctx.username = sessionStorage.getItem('username');

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    editForm: './templates/edit/editForm.hbs'
                }).then(function () {
                    this.partial('./templates/edit/editPage.hbs');
                })
            }).catch(auth.handleError);
        });

        //edit team
        this.post('#/edit/:id', (ctx)=>{
           let id = ctx.params.id.substr(1);
           let name = ctx.params.name;
           let comment = ctx.params.comment;

           teamsService.edit(id, name, comment).then(function () {
               auth.showInfo('Team edited');
              ctx.redirect('#/catalog');
           }).catch(auth.handleError);
        });

        function loadHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.hasTeam = sessionStorage.getItem('teamId') === null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',

            }).then(function () {
                this.partial('./templates/home/home.hbs')
            });
        }

        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            teamsService.loadTeams().then(function (teams) {
                ctx.hasNoTeam = sessionStorage.getItem('teamId') === null
                    || sessionStorage.getItem('teamId') === 'undefined';
                ctx.teams = teams;
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    team: './templates/catalog/team.hbs'
                }).then(function () {
                    this.partial('./templates/catalog/teamCatalog.hbs');
                });
            })
        }
    });

    app.run();
});