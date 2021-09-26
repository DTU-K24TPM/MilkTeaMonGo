var modalEdit = document.getElementById("modal-edit");
var modalAdd = document.getElementById("modal-add-item");
var modalInfo = document.getElementById("modal-info-order");

$('#btn-add-item').on('click', function(){
  modalAdd.style.display = "block";
});
$('#btn-save-new-item').on('click',function(){
  modalAdd.style.display = "none";
  alert('Thêm mới hoàn tất!');
});
$('.edit-item').on('click',function(){
    modalEdit.style.display = "block";
});
$('.close-footer').on('click',function(){
    modalEdit.style.display = "none";
    modalAdd.style.display = "none";
    
});

$('#btn-save-change-item').on('click',function(){
    
    modalEdit.style.display = "none"; 
    alert('Chỉnh sửa hoàn tất!');
});

$('#btn-print').on('click',function(){
  window.print();
});
$('.btn-xoa').on('click',function(){
  alert('Đã xóa!');
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
  