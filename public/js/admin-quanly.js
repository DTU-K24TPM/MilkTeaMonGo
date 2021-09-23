var modalEdit = document.getElementById("modal-edit");
var modalAdd = document.getElementById("modal-add-item");
var modalInfo1 = document.getElementById("modal-info-order1");
var modalInfo2 = document.getElementById("modal-info-order2");
var modalInfo3 = document.getElementById("modal-info-order3");

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
$('.close-footer-info').on('click',function(){
  modalInfo1.style.display = "none";
  modalInfo2.style.display = "none";
  modalInfo3.style.display = "none";
  
});
$('#btn-save-change-item').on('click',function(){
    
    modalEdit1.style.display = "none";
    modalInfo2.style.display = "none";
    modalInfo3.style.display = "none";
    
    alert('Chỉnh sửa hoàn tất!');
});
window.onclick = function (event) {
  if (event.target == modal) {
    modalEdit.style.display = "none";
    modalAdd.style.display = "none";
    modalInfo.style.display = "none";
  }
};
$('.btn-xoa').on('click',function(){
    alert('Đã xóa!');
});

$('#btn-print').on('click',function(){
  window.print();
});
$('.info-order1').on('click',function(){
  modalInfo1.style.display = "block";
});
$('.info-order2').on('click',function(){
  modalInfo2.style.display = "block";
});
$('.info-order3').on('click',function(){
  modalInfo3.style.display = "block";
});
