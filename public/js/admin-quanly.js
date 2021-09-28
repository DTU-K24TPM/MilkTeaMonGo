var modalEdit = document.getElementById("modal-edit");
var modalAdd = document.getElementById("modal-add-item");
var modalInfo = document.getElementById("modal-info-order");

$('#btn-add-item').on('click', function(){
  modalAdd.style.display = "block";
});
$('#btn-save-new-item').on('click',function(){
  modalAdd.style.display = "none";
});

$('.close-footer').on('click',function(){
  modalAdd.style.display = "none";
  $('.imgPreview').attr('src','/img/noimage.jpg');
});

$('#btn-save-change-item').on('click',function(){
    modalEdit.style.display = "none";
});

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


$('.edit-item').each(function () {
  var $this = $(this);
  var modalEdit1 = $this.parent().find('#modal-edit');
  var CloseModal = $this.parent().find('.close-footer');
  $this.on('click',function(){
    modalEdit1.css("display","block"); 
  })
  CloseModal.on('click',function(){
    modalEdit1.css("display","none"); 
  })
  
})


  