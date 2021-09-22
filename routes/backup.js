// <%- include ('../layouts/header') -%>
// <body>
//     <% if (typeof cart != "undefined") { %>
//     <div class="wrapper">
//         <table class="table">
//             <thead class="table-color">
//                 <tr>
//                     <th scope="col" class="col-th"></th>
//                     <th scope="col" class="col-th">Tên sản phẩm</th>
//                     <th scope="col" class="col-th">Số lượng</th>
//                     <th scope="col" class="col-th">Đơn giá</th>
//                     <th scope="col" class="col-th">Thành tiền</th>
//                     <th scope="col" class="col-th"></th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <% var total =0 %>
//                 <% cart.forEach(function(product){ %>
//                     <% var sub1 = 0 %>
//                     <tr class="tr-item">
//                         <th scope="row" class="rowth">
//                            <a href="/product/<%= product.slug%>"><img src="..<%=product.image%>" class="img-th"></a>
//                         </th>
//                         <td class="row1 row11">
//                             <div class="flex-cart">
//                                 <div class="title-cart"><%=product.title%></div>
//                                 <div class="topping-cart">
//                                     <% if (product.topping.length != 0){ %>
//                                         <% for (var i=0;i<product.topping.length;i++) { %>
//                                             <% if (i != product.topping.length-1 ){ %>
//                                                 <%= product.topping[i].title + ", "%>
//                                             <% } else { %>
//                                                 <%= product.topping[i].title %>
//                                             <% } %>
//                                             <% sub1=sub1 + product.topping[i].price %>
//                                         <% } %>
                                            
//                                         <% }  %>   
                                     
                                                            
//                                 </div>

//                                 <% var sub = product.quantity* (sub1+product.price+product.size.price) %>
//                                 <%  total = total + sub %>
//                                 <div class="topping-cart">
//                                     <% if (product.ice == 0) { %>
//                                         Đá chung
//                                     <% } else { %>
//                                         Đá riêng
//                                     <% } %>     
//                                     <%= product.size.title %>                           
//                                 </div>
//                             </div>
//                             </td>
//                         <td class="row1">
//                             <div class="buttons_added btn-add">
//                                 <a class="minus is-form" href="/cart/update/<%= product.idCart%>?action=remove"> - </a>
//                                 <input aria-label="quantity" class="input-qty" max="20" min="1" name="" type="number"
//                                     value= <%= product.quantity %> readonly>
//                                     <a class="plus is-form" href="/cart/update/<%= product.idCart%>?action=add"> + </a>
//                             </div>
//                         </td>
//                         <td class="row1 amount"><%= sub1+product.price+product.size.price %></td>
//                         <td class="row1 total_money"><%= sub %></td>
//                         <td class="row1">
//                             <a class="btn-close btn-xoa confirmDeletion" href="/cart/update/<%= product.idCart%>?action=clear" aria-label="Close"></a>
//                         </td>
//                     </tr>                
//                 <% }) %>
                
                
//             </tbody>

//         </table>
//     </div>
//     <div class="flex-total">
//         <div>
            
//             <a href="/product"><button type="button" class="btn btn-secondary btn-cont">
//                 Tiếp tục mua hàng
//             </button></a>
            
//         </div>
//     <div class="wrapper1">
//         <div class="total-frame">
//             <h5> Giỏ hàng</h5>
//             <div class="span-total"></div>
//             <div class="total">
//                 <div class="text-total">TỔNG TIỀN: </div>
//                 <div class="text-total"><%=total %> VNĐ</div>
//             </div>
//             <a href="/order"> <button type="button" class="btn btn-secondary btn-total">
//                ĐẶT HÀNG
//                </button></a>
//         </div>
//     </div>
        
//     </div>
//     <% } else { %>
//         <div class="dh-frame dh-empty">
//             <img class="img-empty" src="/img/buy1.gif">
//             <h4 class="empty-cart">Giỏ hàng của bạn đang trống, hãy lựa chọn sản phẩm nhé</h4>
//             <div class="btn-empty">
            
//                 <a href="/product"><button type="button" class="btn btn-secondary btn-cont">
//                     Tiếp tục mua hàng
//                 </button></a>
                
//             </div>
//         </div>
        
//     <% } %>



//     <script src="/js/main.js"></script>
//     <script>
//         $()
//     </script>
// </body>

// <%- include ('../layouts/footer') -%>