document.addEventListener('DOMContentLoaded', () => {
    //document.querySelector('#insert-img').onchange = previewFile;
    //document.querySelector('.newpost').onsubmit = newpost;
});


//function previewFile() {
//    document.querySelector('#img-div').style.display = 'block';
//    document.querySelector('#spinner').style.display = 'block';
//    document.querySelector('#del-img').style.display = 'none';
//    document.querySelector('#del-img').addEventListener('click', del_image);
//    var preview = document.querySelector('#img-div');
//    var file    = document.querySelector('input[type=file]').files[0];
//    var reader  = new FileReader();
//    
//    reader.onloadend = function () {
//        preview.style.backgroundImage = `url(${reader.result})`;
//    }
//
//    if (file) {
//        //reader.addEventListener('progress', (event) => {
//        //    document.querySelector('#spinner').style.display = 'block';
//        //});
//        document.querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = false;
//        var promise = new Promise(function(resolve, reject){
//            setTimeout(() => {
//                var read = reader.readAsDataURL(file);
//                resolve(read);
//            },500);
//        });
//        promise 
//            .then(function () { 
//                document.querySelector('#spinner').style.display = 'none';
//                document.querySelector('#del-img').style.display = 'block';
//            })
//            .catch(function () { 
//                console.log('Some error has occured'); 
//            });
//        
//    }
//    else {
//        document.querySelector('#spinner').style.display = 'none';
//        document.querySelector('#del-img').style.display = 'block';
//    }
//}

//function del_image() {
//    document.querySelector('input[type=file]').value = '';
//    document.querySelector('#img-div').style.backgroundImage = '';
//    document.querySelector('#img-div').style.display = 'none';
//    document.querySelector('.form-action-btns').querySelector('input[type=submit]').disabled = true;
//}
