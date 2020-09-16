
document.addEventListener('DOMContentLoaded', () => {
    let active = document.querySelector('.body').dataset.page;
    document.querySelector("#"+active).classList.add('active');
});

function drop_down(event) {
    let drop_down = event.target.parentElement.querySelector(".dropdown-menu");
    setTimeout(() => {
        drop_down.style.display = 'block';
        width = drop_down.offsetWidth;
        let btn_width = drop_down.parentElement.querySelector('button').offsetWidth;
        let left = width-btn_width;
        drop_down.style.left = '-'+left+'px';
        document.addEventListener('keydown', event => {
            if(event.key === 'Escape') {
                drop_down.style.display = 'none';
            }
        });
    }, 100);
}

function remove_drop_down(event) {
    setTimeout(() => {
        event.target.parentElement.querySelector(".dropdown-menu").style.display = 'none';
    },250);
}

function createpost() {
    let popup = document.querySelector(".popup");
    popup.style.display = 'block';
    popup.querySelector('.large-popup').style.display = 'block'
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    document.querySelector('#insert-img').onchange = previewFile;
    popup.querySelector('.large-popup').querySelector('form').setAttribute('onsubmit', '');
    popup.querySelector('.large-popup').querySelector("#post-text").addEventListener('input', (event) => {
        if(event.target.value.trim().length > 0) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else if(event.target.parentElement.querySelector('#img-div').style.backgroundImage) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else {
            popup.querySelector('.submit-btn').disabled = true;
        }
    });
}

function confirm_delete(id) {
    let popup = document.querySelector('.popup');
    popup.style.display = 'block';
    let small_popup = popup.querySelector('.small-popup');
    small_popup.style.display = 'block';
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    small_popup.querySelector('#delete_post_btn').setAttribute('onclick', `delete_post(${id})`);
}

function delete_post(id) {
    remove_popup();
    setTimeout(() => {
        let post = 0;
        document.querySelectorAll('.post').forEach(eachpost => {
            if(eachpost.dataset.post_id==id) {
                post = eachpost;
            }
        });
        post.style.animationPlayState = 'running';
        post.addEventListener('animationend', () => {
            post.remove();
        });
        fetch('/n/post/'+parseInt(id)+'/delete', {
            method: 'PUT'
        });
    },200);
}

function edit_post(element) {
    let post = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    let popup = document.querySelector('.large-popup');
    let promise = new Promise((resolve, reject) => {
        let post_text = post.querySelector('.post-content').innerText;
        let post_image = post.querySelector('.post-image').style.backgroundImage;

        popup.querySelector('#post-text').value = post_text;
        if(post_image) {
            popup.querySelector('#img-div').style.backgroundImage = post_image;
            document.querySelector('#del-img').addEventListener('click', del_image);
            popup.querySelector('#img-div').style.display = 'block';
        }
        else {
            popup.querySelector('#img-div').style.backgroundImage = '';
        }
        resolve(popup);
    });
    promise.then(() => {
        createpost();
        popup.querySelector('form').setAttribute('onsubmit', `return edit_post_submit(${post.dataset.post_id})`);
        popup.querySelector('.submit-btn').disabled = false;
    });
}
function edit_post_submit(post_id) {
    let popup = document.querySelector('.large-popup');
    let text = popup.querySelector('#post-text').value;
    let pic = popup.querySelector('#insert-img');
    let chg = popup.querySelector('#img-change');
    let formdata = new FormData();
    formdata.append('text',text);
    formdata.append('picture',pic.files[0]);
    formdata.append('img_change', chg.value);
    formdata.append('id',post_id);
    fetch('/n/post/'+parseInt(post_id)+'/edit', {
        method:'POST',
        body: formdata
    })
    .then(response => response.json())
    .then(response => {
        if(response.success) {
            let posts = document.querySelectorAll('.post');
            posts.forEach(post => {
                if(parseInt(post.dataset.post_id) === parseInt(post_id)) {
                    if(response.text) {
                        post.querySelector('.post-content').innerText = response.text;
                    }
                    else {
                        post.querySelector('.post-content').innerText = "";
                    }
                    if(response.picture) {
                        post.querySelector('.post-image').style.backgroundImage = `url(${response.picture})`;
                        post.querySelector('.post-image').style.display = 'block';
                    }
                    else {
                        post.querySelector('.post-image').style.backgroundImage = '';
                        post.querySelector('.post-image').style.display = 'none';
                    }
                }
            });
            return false;
        }
        else {
            console.log('There was an error while editing the post.');
        }
    });
    remove_popup();
    return false;
}

function remove_popup() {
    let popup = document.querySelector('.popup');
    popup.style.display = 'none';
    document.querySelector('.body').style.marginRight = '0px';
    document.querySelector('.body').setAttribute('aria-hidden', 'false');
    document.querySelector('body').style.overflow = "auto";
    let small_popup = document.querySelector('.small-popup');
    let large_popup = document.querySelector('.large-popup');
    let login_popup = document.querySelector('.login-popup');
    small_popup.style.display = 'none';
    large_popup.style.display = 'none';
    login_popup.style.display = 'none';
    large_popup.querySelector('#post-text').value = '';
    large_popup.querySelector('#insert-img').value = '';
    large_popup.querySelector('#img-div').style.backgroundImage = '';
    large_popup.querySelector('#img-change').value = 'false';
    large_popup.querySelector('#img-div').style.display = 'none';
}

function login_popup(action) {
    let popup = document.querySelector('.popup');
    popup.style.display = 'block';
    popup.querySelector('.login-popup').style.display = 'block';
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    if(action === 'like') {
        document.querySelector('.icon-div').innerHTML = `
        <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-heart-fill" fill="#e0245e" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>`;
        document.querySelector('.main_text-div').querySelector('h2').innerText = 'Like a post to share the love';
    }
    else if(action === 'comment') {
        document.querySelector('.icon-div').innerHTML = `
        <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-chat-fill" fill="#1da1f2" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
        </svg>`;
        document.querySelector('.main_text-div').querySelector('h2').innerText = 'Comment to join the conversation';
    }
    else if(action === 'save') {
        document.querySelector('.icon-div').innerHTML = `
        <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-bookmark-fill" fill="#17bf63" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12l-5-3-5 3V3z"/>
        </svg>`;
        document.querySelector('.main_text-div').querySelector('h2').innerText = 'Save a post to reference later';
    }
    else if (action === 'follow') {
        document.querySelector('.icon-div').innerHTML = `
        <svg width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="#17bf63" class="r-1re7ezh r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-19einr3 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr">
            <g><path d="M23.152 3.483h-2.675V.81c0-.415-.336-.75-.75-.75s-.75.335-.75.75v2.674H16.3c-.413 0-.75.336-.75.75s.337.75.75.75h2.677V7.66c0 .413.336.75.75.75s.75-.337.75-.75V4.982h2.675c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zM8.417 11.816c1.355 0 2.872-.15 3.84-1.256.813-.93 1.077-2.367.806-4.392-.38-2.826-2.116-4.513-4.646-4.513S4.15 3.342 3.77 6.168c-.27 2.025-.007 3.462.807 4.393.968 1.108 2.485 1.257 3.84 1.257zm-3.16-5.448c.16-1.2.786-3.212 3.16-3.212 2.373 0 2.998 2.013 3.16 3.212.207 1.55.056 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.256-.223-2.71-.743c-.507-.578-.658-1.656-.45-3.205zm11.44 12.867c-.88-3.525-4.283-5.988-8.28-5.988-3.998 0-7.403 2.463-8.28 5.988-.172.693-.03 1.4.395 1.94.408.522 1.04.822 1.733.822H14.57c.69 0 1.323-.3 1.73-.82.425-.54.568-1.247.396-1.942zm-1.577 1.018c-.126.16-.316.245-.55.245H2.264c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.113 1.994 6.824 4.85c.06.24.017.48-.12.655z"></path></g>
        </svg>`;
        document.querySelector('.main_text-div').querySelector('h2').innerText = 'Follow people that inspires you';
    }
}


function previewFile() {
    document.querySelector('#img-div').style.display = 'block';
    document.querySelector('#spinner').style.display = 'block';
    document.querySelector('#del-img').style.display = 'none';
    document.querySelector('#del-img').addEventListener('click', del_image);
    var preview = document.querySelector('#img-div');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    
    reader.onloadend = function () {
        preview.style.backgroundImage = `url(${reader.result})`;
        document.querySelector('.large-popup').querySelector('#img-change').value = 'true';
    }

    if (file) {
        //reader.addEventListener('progress', (event) => {
        //    document.querySelector('#spinner').style.display = 'block';
        //});
        document.querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = false;
        var promise = new Promise(function(resolve, reject){
            setTimeout(() => {
                var read = reader.readAsDataURL(file);
                resolve(read);
            },500);
        });
        promise 
            .then(function () { 
                document.querySelector('#spinner').style.display = 'none';
                document.querySelector('#del-img').style.display = 'block';
            })
            .catch(function () { 
                console.log('Some error has occured'); 
            });
        
    }
    else {
        document.querySelector('#spinner').style.display = 'none';
        document.querySelector('#del-img').style.display = 'block';
    }
}

function del_image() {
    document.querySelector('input[type=file]').value = '';
    document.querySelector('#img-div').style.backgroundImage = '';
    document.querySelector('#img-div').style.display = 'none';
    document.querySelector('.large-popup').querySelector('#img-change').value = 'true';
    if(document.querySelector('.large-popup').querySelector('#post-text').value.trim().length <= 0) {
        document.querySelector('.large-popup').querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = true;
    }
}

function like_post(element) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('like');
        return false;
    }
    let id = element.dataset.post_id;
    fetch('/n/post/'+parseInt(id)+'/like', {
        method: 'PUT'
    })
    .then(() => {
        let count = element.querySelector('.likes_count');
        let value = count.innerHTML;
        value++;
        count.innerHTML = value;
        element.querySelector('.svg-span').innerHTML = `
            <svg width="1.1em" height="1.1em" viewBox="0 -1 16 16" class="bi bi-heart-fill" fill="#e0245e" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>`;
        element.setAttribute('onclick','unlike_post(this)');
    })
}

function unlike_post(element) {
    let id = element.dataset.post_id;
    fetch('/n/post/'+parseInt(id)+'/unlike', {
        method: 'PUT'
    })
    .then(() => {
        let count = element.querySelector('.likes_count');
        let value = count.innerHTML;
        value--;
        count.innerHTML = value;
        element.querySelector('.svg-span').innerHTML = `
            <svg width="1.1em" height="1.1em" viewBox="0 -1 16 16" class="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>`;
        element.setAttribute('onclick','like_post(this)');
    })
}

function save_post(element) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('save');
        return false;
    }
    let id = element.dataset.post_id;
    fetch('/n/post/'+parseInt(id)+'/save', {
        method: 'PUT'
    })
    .then(() => {
        element.querySelector('.svg-span').innerHTML = `
            <svg width="1.1em" height="1.1em" viewBox="0.5 0 15 15" class="bi bi-bookmark-fill" fill="#17bf63" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M3 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12l-5-3-5 3V3z"/>
            </svg>`;
        element.setAttribute('onclick','unsave_post(this)');
    });
}

function unsave_post(element) {
    let id = element.dataset.post_id;
    fetch('/n/post/'+parseInt(id)+'/unsave', {
        method: 'PUT'
    })
    .then(() => {
        element.querySelector('.svg-span').innerHTML = `
        <svg width="1.1em" height="1.1em" viewBox="0.5 0 15 15" class="bi bi-bookmark" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 12l5 3V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10.234z"/>
        </svg>`;
        element.setAttribute('onclick','save_post(this)');
    });
}


function follow_user(element, username, origin) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('follow');
        return false;
    }
    fetch('/'+username+'/follow', {
        method: 'PUT'
    })
    .then(() => {
        if(origin === 'suggestion') {
            element.parentElement.innerHTML = `<button class="btn btn-success" type="button" onclick="unfollow_user(this,'${username}','suggestion')">Following</button>`;
        }
        else if(origin === 'edit_page') {
            element.parentElement.innerHTML = `<button class="btn btn-success float-right" onclick="unfollow_user(this,'${username}','edit_page')" id="following-btn">Following</button>`;
        }
        else if(origin === 'dropdown') {
            ////////////////////////////////////////////////////////////////////////////////////////////
        }

        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === username) {
                document.querySelector('#follower__count').innerHTML++;
            }
        }
        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === document.querySelector('#user_is_authenticated').dataset.username) {
                document.querySelector('#following__count').innerHTML++;
            }
        }
    });
}

function unfollow_user(element, username, origin) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('follow');
        return false;
    }
    fetch('/'+username+'/unfollow', {
        method: 'PUT'
    })
    .then(() => {
        if(origin === 'suggestion') {
            element.parentElement.innerHTML = `<button class="btn btn-outline-success" type="button" onclick="follow_user(this,'${username}','suggestion')">Follow</button>`;
        }
        else if(origin === 'edit_page') {
            element.parentElement.innerHTML = `<button class="btn btn-outline-success float-right" onclick="follow_user(this,'${username}','edit_page')" id="follow-btn">Follow</button>`;
        }
        else if(origin === 'dropdown') {
            ///////////////////////////////////////////////////////////////////////////////////////////
        }

        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === username) {
                document.querySelector('#follower__count').innerHTML--;
            }
        }
        if(document.querySelector('.body').dataset.page === 'profile') {
            if(document.querySelector('.profile-view').dataset.user === document.querySelector('#user_is_authenticated').dataset.username) {
                document.querySelector('#following__count').innerHTML--;
            }
        }
    });
}


function show_comment(element) {
    if(document.querySelector('#user_is_authenticated').value === 'False') {
        login_popup('comment');
        return;
    }
    let post_div = element.parentElement.parentElement.parentElement.parentElement;
    let post_id = post_div.dataset.post_id;
    let comment_div = post_div.querySelector('.comment-div');
    let comment_div_data = comment_div.querySelector('.comment-div-data');
    let comment_comments = comment_div_data.querySelector('.comment-comments');
    if(comment_div.style.display === 'block') {
        comment_div.querySelector('input').focus()
        return;
    }
    comment_div.querySelector('#spinner').style.display = 'block';
    comment_div.style.display = 'block';
    fetch('/n/post/'+parseInt(post_id)+'/comments')
    .then(response => response.json())
    .then(comments => {
        comments.forEach(comment => {
            display_comment(comment,comment_comments);
        });
    })
    .then(() => {
        setTimeout(() => {
            comment_div.querySelector('.spinner-div').style.display = 'none';
            comment_div.querySelector('.comment-div-data').style.display = 'block';
            comment_div.style.overflow = 'auto';
        }, 500);
    });
}

function write_comment(element) {
    let post_id = element.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.post_id;
    let comment_text = element.querySelector('.comment-input').value;
    let comment_comments = element.parentElement.parentElement.parentElement.parentElement.querySelector('.comment-comments');
    let comment_count = comment_comments.parentElement.parentElement.parentElement.querySelector('.cmt-count');
    if(comment_text.trim().length <= 0) {
        return false;
    }
    fetch('/n/post/'+parseInt(post_id)+'/write_comment',{
        method: 'POST',
        body: JSON.stringify({
            comment_text: comment_text
        })
    })
    .then(response => response.json())
    .then(comment => {
        console.log(comment);
        element.querySelector('input').value = '';
        comment_count.innerHTML++;
        display_comment(comment[0],comment_comments,true);
        return false;
    });
    return false;
}

function display_comment(comment, container, new_comment=false) {
    let writer = document.querySelector('#user_is_authenticated').dataset.username;
    let eachrow = document.createElement('div');
    eachrow.className = 'eachrow';
    eachrow.setAttribute('data-id', comment.id);
    eachrow.innerHTML = `
        <div>
            <a href='/${comment.commenter.username}'>
                <div class="small-profilepic" style="background-image: url(${comment.commenter.profile_pic})"></div>
            </a>
        </div>
        <div style="flex: 1;">
            <div class="comment-text-div">
                <div class="comment-user">
                    <a href="/${comment.commenter.username}">
                        ${comment.commenter.first_name} ${comment.commenter.last_name}
                    </a>
                </div>
                ${comment.body}
            </div>
        </div>`;
    if (new_comment) {
        eachrow.classList.add('godown');
        let comments = container.innerHTML;
        container.prepend(eachrow);
    }
    else {
        container.append(eachrow);
    }
}






function goto_register() {
    window.location.href = '/n/register';
}

function goto_login() {
    window.location.href = '/n/login';
}
