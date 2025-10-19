window.priceAlert = function(product){
  const subj=encodeURIComponent("Preis-Alarm: "+product);
  const body=encodeURIComponent("Hallo,\nbitte informieren Sie mich, wenn der Preis fÃ¼r \""+product+"\" fÃ¤llt.\n\nDanke!");
  location.href="mailto:info@example.com?subject="+subj+"&body="+body;
};
