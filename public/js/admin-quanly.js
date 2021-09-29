var modalEdit = document.getElementById("modal-edit");
var modalAdd = document.getElementById("modal-add-item");
var modalInfo = document.getElementById("modal-info-order");

$('#btn-add-item').on('click', function(){
  modalAdd.style.display = "block";
});
// $('#btn-save-new-item').on('click',function(){
//   modalAdd.style.display = "none";
// });

$('.closeAdd').on('click',function(){
  var imgAdd = $('.imgChangeAdd');
  var imgEdit = $('imgEditAdd');
  var nameAdd = $('.nameAdd');
  var unitAdd = $('.unitAdd');
  var priceAdd = $('.priceAdd');
  var quantityAdd = $('.quantityAdd');
  var noteAdd = $('.noteAdd');
  modalAdd.style.display = "none";
  imgAdd.val(null);
  imgEdit.val(null);
  nameAdd.val(null);
  unitAdd.val(null);
  priceAdd.val(null);
  quantityAdd.val(null);
  noteAdd.val(null);
  $('.imgAddPreview').attr('src','/img/noimage.jpg');
  $('.validateAdd').html('');
})

$('.exitAdd').on('click',function(){
  var imgAdd = $('.imgChangeAdd');
  var imgEdit = $('imgEditAdd');
  var nameAdd = $('.nameAdd');
  var unitAdd = $('.unitAdd');
  var priceAdd = $('.priceAdd');
  var quantityAdd = $('.quantityAdd');
  var noteAdd = $('.noteAdd');
  modalAdd.style.display = "none";
  imgAdd.val(null);
  imgEdit.val(null);
  nameAdd.val(null);
  unitAdd.val(null);
  priceAdd.val(null);
  quantityAdd.val(null);
  noteAdd.val(null);
  $('.imgAddPreview').attr('src','/img/noimage.jpg');
  $('.validateAdd').html('');
})

$('.closeEdit').on('click',function(){
  modalEdit.style.display = "none";
  
  $('.validateEdit').html('');
})

$('.exitEdit').on('click',function(){
  modalEdit.style.display = "none";
  
  $('.validateEdit').html('');
})

// $('#btn-save-change-item').on('click',function(){
//     modalEdit.style.display = "none";
// });

$('#btn-print').on('click',function(){
  window.print();
});


$('.info-order').each(function () {
  var $this = $(this);
  var modalInfo1 = $this.parent().find('.modal');
  var CloseModal = $this.parent().find('.close-footer-info');
  
  $this.on('click',function(){
    modalInfo1.css("display","block"); 
  })

  CloseModal.on('click',function(){
        modalInfo1.css("display","none"); 
      })
})


// $('.edit-item').each(function () {
//   var $this = $(this);
//   var modalEdit1 = $this.parent().find('#modal-edit');
//   var CloseModal = $this.parent().find('.close-footer');
//   $this.on('click',function(){
//     modalEdit1.css("display","block"); 
//   })
//   CloseModal.on('click',function(){
//     modalEdit1.css("display","none"); 
//   })
  
// })

  var namee= $('.nameEdit');
  var imageF = $('.imgChangeEdit');
  var image = $('.imgEditPreview');
  var unit = $('.unitEdit');
  var price = $('.priceEdit');
  var quantity = $('.quantityEdit');
  var note = $('.noteEdit');
  var pImage = $('.hiddenImage');
  var form = $('.formEdit');
  var select = $('.select-edit-item');
  var tdTitle;
  var tdUnit;
  var tdCategory;
  var tdPrice;
  var tdQuantity;
  var tdNote;
  var tdImage;
$('.edit-item').each(function () {
  var $this = $(this);
  var id = $this.attr('id');

  $this.on('click',function(){
    tdTitle = $this.closest('.trClosest').find('.tdTitle');
    tdUnit = $this.closest('.trClosest').find('.tdUnit');
    tdCategory = $this.closest('.trClosest').find('.tdCategory');
    tdPrice = $this.closest('.trClosest').find('.tdPrice');
    tdQuantity = $this.closest('.trClosest').find('.tdQuantity');
    tdNote = $this.closest('.trClosest').find('.tdNote');
    tdImage= $this.closest('.trClosest').find('.tdImage');
    $.ajax({
      url: "/admin/products/editBtn",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: function (result) {
        if (result.product.image!= "")
          image.attr('src','/img/product_imgs/'+result.product._id+'/'+result.product.image);
          else image.attr('src','/img/noimage.jpg');
          namee.val(result.product.title);
          unit.val(result.product.unit);
          price.val(result.product.price);
          quantity.val(result.product.quantity);
          note.val(result.product.note);
          pImage.val(result.product.image);
          select.html(result.htmlSelect);
          form.attr('action','/admin/products/edit-product/'+id);
          form.attr('id',id);
          modalEdit.style.display = "block";
      }
  })
    
})

})

$('#btn-save-change-item').on('click',function(e){
  var formm=$('.formEdit')[0];
  var data = new FormData(formm);
  var id = form.attr('id')
  $.ajax({
    url: "/admin/products/edit-product/"+id,
    type: "POST",
    enctype: "multipart/form-data",
    cache:false,
    processData: false,
    contentType: false,
    data: data,

      success: function (result) {
         if ( result.noti != "") $('.validateEdit').html(result.noti);
          else {
           tdImage.html('<img class="admin-img-item" src="'+ result.imageAjax+'">')
           modalEdit.style.display = "none";
           tdTitle.html(namee.val());
           tdUnit.html(unit.val());
           tdCategory.html(select.val()); 
           tdPrice.html(price.val());
           tdQuantity.html(quantity.val()); 
           tdNote.html(note.val()); 
           modalEdit.style.display = "none";
           $('.imgAddPreview').attr('src','/img/noimage.jpg');
          }
      }
  });
  e.preventDefault();
})

$('#btn-save-new-item').on('click',function(e){
  var formm=$('.formAdd')[0];
  var data = new FormData(formm);
  $.ajax({
    url: "/admin/products/add-product/",
    type: "POST",
    enctype: "multipart/form-data",
    cache:false,
    processData: false,
    contentType: false,
    data: data,

      success: function (result) {
         if ( result.noti != "") $('.validateAdd').html(result.noti);
          else {
             // Set the URL to whatever it was plus "#".
             modalAdd.style.display = "none"
             url = document.URL+"#";
             location = "#";

             //Reload the page
              location.reload(true);
          }
      }
  });
  e.preventDefault();
})




  