$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', getWelcomePage);
        this.get('index.html', getWelcomePage);

        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPass;

            if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError('Invalid username!');
            } else if (!/^[A-Za-z0-9]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 character long and contains letters and digits!')
            } else if (password !== repeatPassword) {
                notify.showError('Password must be the same!');
            } else {
                auth.register(username, password).then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notify.showInfo('Registration successful');
                    ctx.redirect('#/catalog');
                }).catch(notify.handleError)
            }

        });

        this.post('#/login', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password).then(function (userInfo) {
                auth.saveSession(userInfo);
                notify.showInfo('Login successful');
                ctx.redirect('#/catalog');
            }).catch(notify.handleError);

        });

        this.get('#/logout', (ctx) => {
            auth.logout().then(function () {
                sessionStorage.clear();
                notify.showInfo('Successfully logged out');
                ctx.redirect('#/home');
            }).catch(notify.handleError)
        });

        this.get('#/catalog', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            posts.getAllPosts().then(function (posts) {
                posts.forEach((p, i) => {
                    p.rank = i + 1;
                    p.isAuthor = sessionStorage.getItem('userId') === p._acl.creator;
                    p.date = calcTime(p._kmd.ect);
                });
                ctx.isLoggedIn = auth.isAuth();
                ctx.posts = posts;
                ctx.username = sessionStorage.getItem('username');

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    post: './templates/posts/post.hbs',
                    navigation: './templates/common/navigation.hbs',
                    postsList: './templates/posts/posts.hbs'
                }).then(function () {
                    this.partial('./templates/posts/catalog.hbs')
                })

            }).catch(notify.handleError)
        });

        this.get('#/create/post', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            ctx.isLoggedIn = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs'
            }).then(function () {
                this.partial('./templates/createPost/createPost.hbs')
            })
        });

        this.post('#/create/post', (ctx) => {
            let url = ctx.params.url;
            let title = ctx.params.title;
            let imageUrl = ctx.params.image;
            let comment = ctx.params.comment;
            let author = sessionStorage.getItem('username');

            if (!/^http/.test(url)) {
                notify.showError('URL should start with "http"')
            } else if (title.length < 1) {
                notify.showError('"Title" should be filled')
            } else {
                posts.createPost(author, title, comment, url, imageUrl).then(function () {
                    notify.showInfo('Post created');
                    ctx.redirect('#/catalog');
                }).catch(notify.handleError)
            }
        });

        this.get('#/edit/post/:postId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            let postId = ctx.params.postId.substr(1);
            posts.getPostDetails(postId).then(function (postInfo) {
                ctx.post = postInfo;
                ctx.isLoggedIn = auth.isAuth();
                ctx.username = sessionStorage.getItem('username');

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    navigation: './templates/common/navigation.hbs',
                }).then(function () {
                    this.partial('./templates/editPost/editPost.hbs')
                })
            })
        });

        this.post('#/edit/post', (ctx) => {
            console.log(ctx.params);
            let postId = ctx.params.postId;
            let url = ctx.params.url;
            let title = ctx.params.title;
            let imageUrl = ctx.params.image;
            let comment = ctx.params.description;
            let author = sessionStorage.getItem('username');

            if (!/^http/.test(url)) {
                notify.showError('URL should start with "http"')
            } else if (title.length < 1) {
                notify.showError('"Title" should be filled')
            } else {
                posts.editPost(postId, author, title, comment, url, imageUrl).then(function () {
                    notify.showInfo('Post edited');
                    ctx.redirect('#/catalog');
                }).catch(notify.handleError)
            }
        });

        this.get('#/delete/post/:postId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            let postId = ctx.params.postId.substr(1);
            console.log(postId);
            posts.deletePost(postId).then(function () {
                notify.showInfo('Post deleted.');
                ctx.redirect('#/catalog');
            }).catch(notify.handleError)
        });

        this.get('#/details/post/:postId', (ctx) => {
            let postId = ctx.params.postId;
            let postPromise = posts.getPostDetails(postId);
            let allCommentsPromise = comments.getAllPostComments(postId);

            Promise.all([postPromise, allCommentsPromise]).then(([post, comments]) => {
                console.log([post, comments])
                post.date = calcTime(post._kmd.ect);
                post.isAuthor = sessionStorage.getItem('username') === post._acl.creator;

                comments.forEach((c) => {
                    c.date = calcTime(c._kmd.ect);
                    c.commentAuthor = sessionStorage.getItem('userId') === c._acl.creator;
                });
                ctx.isLoggedIn = auth.isAuth();
                ctx.username = sessionStorage.getItem('username');
                ctx.post = post;
                ctx.comments = comments;

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    navigation: './templates/common/navigation.hbs',
                    postDetails: './templates/details/postDetails.hbs',
                    comment: './templates/details/comment.hbs'
                }).then(function () {
                    this.partial('./templates/details/postDetailsPage.hbs');
                });
            }).catch(notify.handleError);
        });

        this.get('#/posts', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            posts.getMyPosts(sessionStorage.getItem('username')).then(function (posts) {
                posts.forEach((p, i) => {
                    p.rank = i + 1;
                    p.date = calcTime(p._kmd.ect);
                });
                ctx.isLoggedIn = auth.isAuth();
                ctx.posts = posts;
                ctx.username = sessionStorage.getItem('username');

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    post: './templates/myPosts/myPost.hbs',
                    navigation: './templates/common/navigation.hbs',
                }).then(function () {
                    this.partial('./templates/myPosts/myPosts.hbs')
                })

            }).catch(notify.handleError)
        });

        this.post('#/create/comment', (ctx) => {
            let author = sessionStorage.getItem('username');
            let content = ctx.params.content;
            let postId = ctx.params.postId;

            if (content.length < 1) {
                notify.showError('Cannot add empty comment');
                return;
            }
            comments.createComment(postId, content, author).then(function () {
                notify.showInfo('Comment created.');
                ctx.redirect(`#/details/post/${postId}`);
            }).catch(notify.handleError)
        });

        this.get('#/comment/delete/:commentId/post/:postId', (ctx) => {
            let commentId = ctx.params.commentId;
            let postId = ctx.params.postId;

            comments.deleteComment(commentId).then(() => {
                notify.showInfo('Comment deleted');
                ctx.redirect(`#/details/post/${postId}`);
            }).catch(notify.handleError);

            console.log(commentId, postId);
        });

        function getWelcomePage(ctx) {

            if (!auth.isAuth()) {
                ctx.isLoggedIn = auth.isAuth();
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    loginForm: './templates/forms/loginForm.hbs',
                    registerForm: './templates/forms/registerForm.hbs'
                }).then(function () {
                    this.partial('./templates/welcome/welcome-notloggedin.hbs');
                })
            } else {
                ctx.redirect('#/catalog');
            }
        }

        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);

            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }

    });

    app.run();
});