let downloadCsv = document.getElementById('download-csv');


downloadCsv.onclick = function(element){
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {


      console.log(tabs);

      var code = getGiorni.toString();
      code += ";getGiorni()";



      chrome.tabs.executeScript(
        tabs[0].id,
        {
          code:code
        },
      function(results){ console.log(results); } );

    });
}

function getGiorni(){
  var table = document.getElementById("TBLGRDCARTELLINO");
  var rows = table.getElementsByTagName("tr");
  var giorni = [];
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    var cols = row.getElementsByTagName("td");
    var col0 = cols[0];
    if(col0){
      var day = col0.innerText;
      console.log(day);
      var giorno = {giorno:day, timbrature:[]};
      for (var c = 4; c < cols.length; c++) {
        var timbratura_col = cols[c];
        if(!timbratura_col){continue;}
        var inputs = timbratura_col.getElementsByTagName("input");
        if(inputs && inputs.length>0){
          var timbratura_input = inputs[0];
          var timbratura = timbratura_input.value;
          console.log("\t"+timbratura);
	  giorno.timbrature.push(timbratura)
        }

      }
      giorni.push(giorno);
    }

  }
  console.log(giorni);

  var csv_rows = [];
  giorni.forEach(function(giorno){
    var csv_row = [];
    csv_row.push(giorno.giorno);
    for(var i=0;i<10;i++){
      var t = giorno.timbrature[i] || '';
      csv_row.push(t);
    }
    csv_rows.push(csv_row);
  });
  console.log(csv_rows);

  var csv = "";
  csv_rows.forEach(function(row){
    csv += row.join('\t')+'\n';
  });

  var link = document.createElement("a");
  link.textContent = "CSV pronto per essere scaricato: Clicca QUI";
  link.download = "file.csv";
  link.href = "data:text/csv,"+csv
  document.body.appendChild(link);

}
