
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    document.querySelector('#popup-btn').onclick = show_popup;
    document.querySelector('.textarea').addEventListener('input', expand_control);
    document.querySelector('#insert-img').onchange = previewFile;
});
function expand_control() {
    if (document.querySelector('.textarea').offsetHeight > 410) {
        document.querySelector('.textarea').style.overflow = 'auto';
    }
    else {
        document.querySelector('.textarea').style.overflow = 'hidden';
    }
}
function show_popup() {
    document.querySelector('.blackout').style.display = 'block';
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.body').setAttribute('aria-hidden', 'true');
    document.querySelector('.blackout').onclick = remove_popup;
    document.querySelector('.close-popup-btn').onclick = remove_popup;
    document.addEventListener('keydown', event => {
        if(event.key === 'Escape') {
            remove_popup();
        }
    });
    //document.querySelector('.body').style.position = 'fixed';
    disableScroll();
}
function remove_popup() {
    document.querySelector('.blackout').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.body').setAttribute('aria-hidden', 'false');
    //document.querySelector('.body').style.position = 'fixed';
    enableScroll();
}

function disableScroll() { 
    // Get the current page scroll position 
    scrollTop =  
      window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft =  
      window.pageXOffset || document.documentElement.scrollLeft, 

        // if any scroll is attempted, 
        // set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
} 

function enableScroll() { 
    window.onscroll = function() {}; 
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
        preview.style.backgroundImage = `url()`;
    }
}
function del_image() {
    document.querySelector('input[type=file]').value = '';
    document.querySelector('#img-div').style.backgroundImage = '';
    document.querySelector('#img-div').style.display = 'none';
}