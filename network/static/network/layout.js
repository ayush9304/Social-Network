
document.addEventListener('DOMContentLoaded', () => {
    let active = document.querySelector('.body').dataset.page;
    document.querySelector("#"+active).classList.add('active');
});

function drop_down(event) {
    let drop_down = event.target.parentElement.querySelector(".dropdown-menu");
    drop_down.style.display = 'block';
    //document.querySelector('.dropdown-menu').style.display = 'block';
    document.addEventListener('keydown', event => {
        if(event.key === 'Escape') {
            drop_down.style.display = 'none';
        }
    });
}

function remove_drop_down(event) {
    setTimeout(() => {
        event.target.parentElement.querySelector(".dropdown-menu").style.display = 'none';
    },100);
}

function createpost() {
    let popup = document.querySelector(".popup");
    popup.style.display = 'block';
    popup.querySelector('.large-popup').style.display = 'block'
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('body').style.overflow = "hidden";
    document.querySelector('#insert-img').onchange = previewFile;
    popup.querySelector('.large-popup').querySelector("#post-text").addEventListener('input', (event) => {
        if(event.target.value.trim().length > 0) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else if(event.target.parentElement.querySelector('#insert-img').value) {
            popup.querySelector('.submit-btn').disabled = false;
        }
        else {
            popup.querySelector('.submit-btn').disabled = true;
        }
    });
}

function remove_popup() {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.body').setAttribute('aria-hidden', 'false');
    document.querySelector('body').style.overflow = "auto";
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
    if(document.querySelector('.large-popup').querySelector('#post-text').value.trim().length <= 0) {
        document.querySelector('.large-popup').querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = true;
    }
}