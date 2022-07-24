choosePC();

function choosePC() {
  let imgPath = "./img/pc/" + album + "/" + member + ".jpeg";
  document.getElementById("randomPC").src = imgPath;
}
