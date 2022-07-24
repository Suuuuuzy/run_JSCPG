var albums = new Array("yourchoiceoneside", "yourchoiceotherside", "yourchoicebeside", "yourchoicebeside2");

var members = new Array(
  "scoups",
  "jeonghan",
  "joshua",
  "jun",
  "hoshi",
  "wonwoo",
  "woozi",
  "the8",
  "mingyu",
  "dk",
  "seungkwan",
  "vernon",
  "dino"
);

var semicolonMemberToColor = {
  scoups: "#004475",
  jeonghan: "#977524",
  joshua: "#3951ad",
  jun: "#552a21",
  hoshi: "#082a40",
  wonwoo: "#e16530",
  woozi: "#265ba7",
  the8: "#b5aa81",
  mingyu: "#0189bb",
  dk: "#d4b32f",
  seungkwan: "#721709",
  vernon: "#d11d31",
  dino: "#439786"
};

var henggaraeMemberToColor = {
  scoups: "#a2160c",
  jeonghan: "#ae7923",
  joshua: "#536e73",
  jun: "#b37b06",
  hoshi: "#2a4003",
  wonwoo: "#955e1c",
  woozi: "#5c3b1a",
  the8: "#335467",
  mingyu: "#625622",
  dk: "#414619",
  seungkwan: "#445b24",
  vernon: "#b97383",
  dino: "#526c27"
};

var anodeMemberToColor = {
  scoups: "#bb8e57",
  jeonghan: "#6959a9",
  joshua: "#9a1705",
  jun: "#398d9d",
  hoshi: "#72422f",
  wonwoo: "#873325",
  woozi: "#849232",
  the8: "#5ca6d8",
  mingyu: "#aa8459",
  dk: "#413127",
  seungkwan: "#963019",
  vernon: "#99682d",
  dino: "#26a243"
};

var ymmdawnMemberToColor = {
  scoups: "#6f3317",
  jeonghan: "#0148af",
  joshua: "#3653dc",
  jun: "#306890",
  hoshi: "#1c2434",
  wonwoo: "#37333e",
  woozi: "#703b1e",
  the8: "#a86a3b",
  mingyu: "#913b14",
  dk: "#07517b",
  seungkwan: "#2d2a61",
  vernon: "#5c6474",
  dino: "#5a3825"
};

var albumToMemberToColor = {
  semicolon: semicolonMemberToColor,
  henggarae: henggaraeMemberToColor,
  anode: anodeMemberToColor,
  ymmdawn: ymmdawnMemberToColor
};

var albumToFont = {
  yourchoiceoneside: "Homemade Apple",
  yourchoiceotherside: "Homemade Apple",
  yourchoicebeside: "Homemade Apple",
  yourchoicebeside: "Homemade Apple",
  semicolon: "Corben",
  henggarae: "Poller One",
  anode: "Vesper Libre",
  ymmdawn: "Anton"
};

var album;
var member;

setTheme();

///// functions /////

function setTheme() {
  member = members[Math.floor(Math.random() * members.length)];
  album = albums[Math.floor(Math.random() * albums.length)];

  let themeColor = getThemeColor(album, member);
  document.documentElement.style.setProperty("--main-accent-color", themeColor);

  let themeFont = getThemeFont(album);
  document.documentElement.style.setProperty("--header-font", themeFont);
}

function getThemeColor(album, member) {
  switch (album) {
    case "yourchoiceoneside":
      return "#ce5d00";
    case "yourchoiceotherside":
      return "navy";
    case "yourchoicebeside":
    case "yourchoicebeside2":
      return "green";
    default:
      try {
        return albumToMemberToColor[album][member] ?? "black";
      }
      catch {
        return "black";
      }
  }
}

function getThemeFont(album) {
  try {
    return albumToFont[album] ?? "Homemade Apple";
  }
  catch
  {
    return "Homemade Apple";
  }
}
