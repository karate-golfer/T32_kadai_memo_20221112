 $(function(){
  var now_date = new Date();
  var now_month = now_date.getFullYear()+'/'+(now_date.getMonth()+1);
  $("#target_month").append(now_month);
  buildTable();
  sum();
  createDeleteEvent();


  function removeLocalStorage(name){
    if(isBlank(name)){
      alert("error!!");
      return false;
    }
    localStorage.removeItem(name);
  }


  function removeLocalStorageAll(){
    localStorage.clear();
  }

  function getLocalStorageItem(name){
    if(isBlank(name)) return;
    return localStorage.getItem(name);
  }

  function saveLocalStorage(name,data){
    if(isBlank(name) || isBlank(data)){
      alert("error!!");
      return false;      
    }
    localStorage.setItem(name, data);
    return true;
  }

  function getLocalStorageName(ym = ''){
    var base_name = '_training';
    if(isBlank(ym)){
      var target_month = $("#target_month").text();
      ym = target_month.replace( /\//g , "" );
    }
    return ym + base_name;
  }

  function buildTable(){
    var tableBody = "";
    $("table tbody tr").remove();

  var localStorage_name = getLocalStorageName();
  var localSt = getLocalStorageItem(localStorage_name);
  var localStJSON = JSON.parse(localSt);

  $(localStJSON).map(function(index, line){
    tableBody +="<tr>";
    tableBody +="<td>" + line["date"] + "</td>";
    tableBody +="<td class='name'>"; + line["name"] + "</td>";
    tableBody +="<td class='times'>"; + line["times"] + "</td>";
    tableBody +='<td><input type="button" class="delete" value="削除"></td>';
    tableBody +="</tr>";
  });
  $('table tbody').append(tableBody);
}

function isBlank(data){
  if (data.length ==0 || data == ''){
    return true;
  } else {
    return false;
  }
}

function sum(){
  var timesList = $("table td[class=times]").map(function(index, val){
    var times = parseInt($(val).text());
    if(times >= 0) {
      return times; 
    } else {
      return null;
    }
  });

  var total = 0;
  timesList.each(function(index, val){
    total = total + val;
  });
  $(".sum_times").text("合計："+total+"回");
}

function getJsonFromTable(){
  var counter = 0;
  var line    = [];
  $("table tbody tr").map(function(index,val){
    line[counter] = {"date":$(val).children().eq(0).text()
                ,"name":$(val).children().eq(1).text()
                ,"times":$(val).children().eq(2).text()};
    counter += 1;
  });
  return line;
}

function createDeleteEvent(){
  $(document).on("click", ".delete", function(event){
    var target = $(event.target);
    target.parents("tr").remove();
    sum();
    var line = getJsonFromTable();
    var mainJSON = JSON.stringify(line);
    saveLocalStorage(getLocalStorageName(),mainJSON);
  });
}



$("#get_before_month").click(function(){
  var target_month_str = $("#target_month").text();
  var target_month_array = target_month_str.split("/");
  var last_date = new Date(target_month_array[0], target_month_array[1]-2, 1);
  var last_month = last_date.getFullYear()+ '/' +(last_date.getMonth()+1);
  var last_ym    = last_date.getFullYear().toString() + (last_date.getMonth()+1).toString();
  $("#target_month").text(last_month);
  buildTable();
  sum();
  createDeleteEvent();
});


$("#get_next_month").click(function(){
  var target_month_str = $("#target_month").text();
  var target_month_array = target_month_str.split("/");
  var next_date = new Date(target_month_array[0], target_month_array[1], 1);
  var next_month = next_date.getFullYear()+ '/' +(next_date.getMonth()+1);
  var next_ym    = next_date.getFullYear().toString() + (next_date.getMonth()+1).toString();
  $("#target_month").text(next_month);
  buildTable();
  sum();
  createDeleteEvent();
});

$("#add").click(function(){
  var name = $("#training").val();
  var times = $("#times").val();
  var date = new Date();
  var str_date = date.getFullYear()+ '/' +(date.getMonth()+1)+ '/' +date.getDate();

  if(isBlank(name) || isBlank(times)){
    alert('空欄があります');
    return;
  }
  if(!$.isNumeric(times)){
    alert('回数は半角数字で入力してください');
    return;
  }

  $('table').append('<tr><td>'+str_date + '</td>'
  +'<td class="name">' + name + '</td>'
  +'<td class="times">' + times + '</td>'
  +'<td><input type="button" class="delete" value="削除"></td>'
  +'</tr>');

  var product = {"date":str_date, "name":name, "times":times};
  var mainArray =[];
  var localStJSON = getLocalStorageItem(getLocalStorageName());
  if(localStJSON != null && localStJSON !=""){
  var mainArray = JSON.parse(localStJSON);
  }

mainArray.push(product);

var mainJSON = JSON.stringify(mainArray);
saveLocalStorage(getLocalStorageName(), mainJSON);
sum();
createDeleteEvent();
});



$("#clear").click(function(){
  if(!confirm('当月分のデータを削除します。OK?')){
    return false;
  }else{
    removeLocalStorage(getLocalStorageName());
    $("table tbody tr").remove();
    sum();
  }
});
});