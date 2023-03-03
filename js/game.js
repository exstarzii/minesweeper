window.onload = function startGame() {
  let table = document.getElementsByClassName("table")[0];
  table.innerHTML="";
  let smile = document.getElementsByClassName("smile")[0];
  let timerSymb = document.getElementsByClassName("timerSymb");
  let countSymb = document.getElementsByClassName("countSymb");
  let maxX = 16;
  let maxY = 16;
  let mines = 40;
  let remainMines = mines+1;
  let hiddenCells = maxX*maxY;
  let arrView = [];
  document.onmouseup=()=>{
    if(smile.dataset["display"] == ":0"){
      smile.dataset["display"] = "[:)]";
    }
  }
  smile.onmousedown = ()=>{
    smile.dataset["display"] = "]:)[";
  };
  smile.onmouseup = ()=>{
    smile.dataset["display"] = "[:)]";
    clearInterval(timerId);
    for (let index = timerSymb.length-1; index>=0; index--) {
      timerSymb[index].dataset["display"] = "0";
    }
    startGame();
  };
  let time=0;
  let timerId;
  onSetFlag(true);

  for (let i = 0; i < maxY; i++) {
    let row = document.createElement("div");
    row.className = "row";
    table.append(row);
    arrView.push([]);
    for (let j = 0; j < maxX; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = () => {
        if(arrView[i][j].dataset["display"] != "hidden"){
          return;
        }
        init(i, j);
      };
      cell.oncontextmenu = ()=>{
        next ={
          "hidden":"flag",
          "flag":"?",
          "?":"hidden"
        }
        arrView[i][j].dataset["display"] = next[arrView[i][j].dataset["display"]];
        if(arrView[i][j].dataset["display"] == "flag"){
          onSetFlag(true);
        }else if(arrView[i][j].dataset["display"] == "?"){
          onSetFlag(false);
        }
        return false;
      };
      cell.onmousedown = ()=>{
        smile.dataset["display"] = ":0";
      };
      cell.onmouseup = ()=>{
        smile.dataset["display"] = "[:)]";
      };
      cell.dataset["display"] = "hidden";
      cell.dataset["value"] = 0;
      row.append(cell);
      arrView[i].push(cell);
    }
  }
  function onSetFlag(bool){
    if(bool == true){
      remainMines--
    }else{
      remainMines++
    }
    let minesStr;
    if(remainMines>99){
      minesStr = remainMines.toString();
    }else if(remainMines>9){
      minesStr ="0"+ remainMines.toString();
    }else{
      minesStr ="00"+ remainMines.toString();
    }
    for (let index = 0; index < countSymb.length; index++) {
      countSymb[index].dataset["display"] = minesStr[index]==undefined?"0":minesStr[index];
    }
  }

  function cellClick(event, y, x) {
    if(arrView[y][x].dataset["display"] != "hidden"){
      return;
    }
    if (event.button == 0) {
      arrView[y][x].dataset["display"] =arrView[y][x].dataset["value"];
      hiddenCells--;
      if(hiddenCells == mines){
        //alert("You win!!!");
        clearInterval(timerId);
        smile.dataset["display"] = "B)";
        for (let i = 0; i < maxY; i++) {
          for (let j = 0; j < maxX; j++) {
            arrView[i][j].onclick=null;
            arrView[i][j].onmouseup=null;
            arrView[i][j].onmousedown=null;
          }
        }
      }else if (arrView[y][x].dataset["value"] == "0") {
        //open cells recurse
        openCellsNearly(y, x);
      } else if (arrView[y][x].dataset["value"] == "-1") {
        for (let i = 0; i < maxY; i++) {
          for (let j = 0; j < maxX; j++) {
            arrView[i][j].onclick=null;
            arrView[i][j].onmouseup=null;
            arrView[i][j].onmousedown=null;
            arrView[i][j].oncontextmenu=()=>{return false};
            if (arrView[i][j].dataset["value"] == "-1") {
              arrView[i][j].dataset["display"] = "mine";
            }else if(arrView[i][j].dataset["display"] == "flag"){
              arrView[i][j].dataset["display"] = "mineFalse";
            }
          }
        }
        clearInterval(timerId);
        arrView[y][x].dataset["display"] = "mineActive";
        smile.dataset["display"] = "x(";
        //alert("You lose!!!");
      }
    }
  }
  function init(starty, startx) {
    timerId = setInterval(() =>{
      time++;
      if(time>999){
        clearInterval(timerId);
        return;
      }
      let timeStr;
      if(time>99){
        timeStr = time.toString();
      }else if(time>9){
        timeStr ="0"+ time.toString();
      }else{
        timeStr ="00"+ time.toString();
      }
      for (let index = timerSymb.length-1; index>=0; index--) {
        timerSymb[index].dataset["display"] = timeStr[index];
      }
    }, 1000);
    for (let i = 0; i < maxY; i++) {
      for (let j = 0; j < maxX; j++) {
        arrView[i][j].onclick = (event) => {
          cellClick(event, i, j);
        };
      }
    }
    let temp = mines;
    while (temp > 0) {
      let x = Math.floor(Math.random() * maxX);
      let y = Math.floor(Math.random() * maxY);
      //console.log(x,y)
      if (
        arrView[y][x].dataset["value"] == "-1" ||
        (startx == x && starty == y)
      ) {
        continue;
      }
      arrView[y][x].dataset["value"] = "-1";
      //arrView[y][x].dataset["display"] = "mine";
      temp--;
    }
    for (let i = 0; i < maxY; i++) {
      for (let j = 0; j < maxX; j++) {
        if (arrView[i][j].dataset["value"] == "-1") {
          setNumbersAroundMine(i, j);
        }
      }
    }
    arrView[starty][startx].dataset["display"] =
      arrView[starty][startx].dataset["value"];
      hiddenCells--;
    if (arrView[starty][startx].dataset["value"] == "0") {
      //open cells recurse
      openCellsNearly(starty, startx);
    }
  }
  function openCellsNearly(y, x) {
    for (let xx of [-1, 0, 1]) {
      for (let yy of [-1, 0, 1]) {
        if (
          arrView[y + yy] != undefined &&
          arrView[y + yy][x + xx] != undefined &&
          arrView[y + yy][x + xx].dataset["display"] == "hidden"
        ) {
          arrView[y + yy][x + xx].dataset["display"] =
            arrView[y + yy][x + xx].dataset["value"];
            hiddenCells--;
          if (arrView[y + yy][x + xx].dataset["value"] == "0") {
            openCellsNearly(y + yy, x + xx);
          }
        }
      }
    }
  }
  function setNumbersAroundMine(y, x) {
    for (let xx of [-1, 0, 1]) {
      for (let yy of [-1, 0, 1]) {
        if (
          arrView[y + yy] == undefined ||
          arrView[y + yy][x + xx] == undefined ||
          arrView[y + yy][x + xx].dataset["value"] == "-1"
        ) {
          continue;
        }
        arrView[y + yy][x + xx].dataset["value"] =
          +arrView[y + yy][x + xx].dataset["value"] + 1;
        //arrView[y+yy][x+xx].dataset["display"] = +arrView[y+yy][x+xx].dataset["value"];
      }
    }
  }
};
