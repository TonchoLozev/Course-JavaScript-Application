let comments = (() => {
    function getAllPostComments(postId) {
        let endpoint = `comments?query={"postId":"${postId}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint, 'kinvey');
    }
    function createComment(postId, content, author){
        let endpoint = `comments`;
        let data = {postId, content, author};

        return requester.post('appdata', endpoint, 'kinvey', data)
    }
    function deleteComment(commentId){
        let endpoint = `comments/${commentId}`;
        return requester.remove('appdata', endpoint, 'kinvey');
    }

    return{
        getAllPostComments,
        createComment,
        deleteComment
    }
})();