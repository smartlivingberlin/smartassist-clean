window.exportCSV = function(rows, filename="export.csv"){
  const esc=s=>('"'+String(s).replace(/"/g,'""')+'"');
  const body=rows.map(r=>r.map(esc).join(',')).join('\n');
  const blob=new Blob([body],{type:"text/csv;charset=utf-8"});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); URL.revokeObjectURL(a.href);
};
