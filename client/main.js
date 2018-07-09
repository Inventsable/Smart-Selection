var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;
var alignSolo, lastNum;

var sNode = {
  NW:null,
  N:null,
  NE:null,
  W:null,
  Center:null,
  E:null,
  SW:null,
  S:null,
  SE:null,
  boundBox:null
}
for (var d in sNode) {
  sNode[d] = this[d];
}

var input = {
  x1:null,
  y1:null,
  x2:null,
  y2:null,
  w:null,
  h:null,
  aX:null,
  aY:null,
  aW:null,
  aH:null,
  nX:null,
  nY:null,
};
for (var e in input) {
  input[e] = this[e];
}

var coords = {
  rel : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
  },
  artB : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
    index:null,
  },
  abs : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
  },
  which: "selection"
};

loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
loadJSX(`smartAlign.jsx`);
loadJSX(`${appName}.jsx`);
console.log(appUI);
var scanSel, scanAB, lastA;
scanningSelection(true);
scanningArtboard(true);


function scanningArtboard(state) {
  var res, here;
  var parm = ["x1", "y1", "x2", "y2", "w", "h", "index"];
  if (state) {
		timerAB = setInterval(function(){csInterface.evalScript('scanCurrentArtboard();', function(a){
      if (a == scanAB) return;
      if (a !== scanAB) {
        console.log('Artboard changed');
        csInterface.evalScript(`updateArtboardDimensions(${a});`, function(aa){
          var res = aa.split(',');
          for (var m = 0; m < res.length; m++) {
            here = parm[m];
            coords.artB[here] = parseInt(res[m]);
          };
          input.aX.value = parseInt(res[0]);
          input.aY.value = parseInt(res[1]);
          input.aW.value = parseInt(res[4]);
          input.aH.value = parseInt(res[5]);
          // console.log(coords.artB);
        });
      }
      scanAB = a;
    })}, 50);
    console.log("Scanning artboard on");
	} else {
		clearInterval(timerAB);
		console.log("Scanning artboard off");
	}
}

function scanningSelection(state) {
	if (state) {
		timer = setInterval(function(){csInterface.evalScript('selectScanner();', function(a){
      if (a == scanSel) return;
      scanResults(a);
      scanSel = a;
    })}, 50);
		console.log("Scanning on");
	} else {
		clearInterval(timer);
		console.log("Scanning off");
	}
}

function scanResults(a) {
  var res, here, type;
  var parm = ["x1", "y1", "x2", "y2", "w", "h"];
  if (a !== lastNum) {
    if (a == 1)
      alignSolo = true;
    if (a > 0) {
      if (a > 1) {
        csInterface.evalScript(`getBounds(selection, 'geometricBounds')`, function(e){
          alignSolo = false;
          type = e.split(";")
          res = type[0].split(",");
          for (var m = 0; m < res.length; m++) {
            if (res[m] == null) break;
            here = parm[m];
            coords.rel[here] = parseInt(res[m]);
            input[here].value = parseInt(res[m]);
          };
          absRes = type[1].split(",");
          for (var m = 0; m < absRes.length; m++) {
            if (res[m] == null) break;
            here = parm[m];
            coords.abs[here] = parseInt(absRes[m])
          };
        })
      }
      sNode.NW.style.borderColor = appUI.color.Focus;
      sNode.SE.style.borderColor = appUI.color.Focus;
      sNode.boundBox.style.borderColor = appUI.color.Focus;
    } else {
      res = ["", "", "", "", "", ""];
      sNode.NW.style.borderColor = appUI.color.Border;
      sNode.SE.style.borderColor = appUI.color.Border;
      sNode.boundBox.style.borderColor = appUI.color.Border;
    }
    try {
      for (var m = 0; m < res.length; m++) {
        here = parm[m];
        input[here].value = res[m];
      };
    } catch(e){return}
  }
  lastNum = a;
}


function getCoords(node) {
  var resultX, resultY;
  if ((node == 'N') || (node == 'Center') || (node == 'S')) {
    resultX = parseInt((input.w.value/2)) + parseInt(input.x1.value);
  } else if ((node == 'NE') || (node == 'E') || (node == 'SE')) {
    resultX = parseInt(input.w.value) + parseInt(input.x1.value);
  } else {
    resultX = parseInt(input.x1.value);
  }
  if ((node == 'NW') || (node == 'N') || (node == 'NE')) {
    resultY = parseInt(input.y1.value);
  } else if ((node == 'W') || (node == 'Center') || (node == 'E')) {
    resultY = parseInt((input.h.value/2)) + parseInt(input.y1.value);
  } else {
    resultY = parseInt(input.h.value) + parseInt(input.y1.value);
  }
  input.nX.value = resultX;
  input.nY.value = resultY;
}

var node = [].slice.call(document.getElementsByClassName('selectNode'));
node.forEach(function(v,i,a) {
  v.addEventListener("click", function(e){
    getCoords(v.id);
    var yOff;
    if (alignSolo) {
      yOff = (coords.artB.index < 1) ? coords.artB.y2 * -1 : coords.artB.y2;
      csInterface.evalScript(`alignSingleToArtboard('${v.id}', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
    } else {
      if (e.shiftKey) {
        console.log(coords.artB);
        yOff = (coords.artB.index < 1) ? coords.artB.y2 * -1 : coords.artB.y2;
        csInterface.evalScript(`alignSelection('align', 'artboard', '${v.id}', ${coords.artB.x1}, ${coords.artB.y1}, ${coords.artB.x2}, ${yOff})`);
      } else if (e.altKey) {
        yOff = (coords.abs.index < 1) ? coords.abs.y2 * -1 : coords.abs.y2;
        csInterface.evalScript(`alignSelection('distribute', 'selection', '${v.id}', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
      } else {
        yOff = (coords.abs.index < 1) ? coords.rel.y2 : coords.abs.y2;
        csInterface.evalScript(`alignSelection('align', 'selection', '${v.id}', ${coords.abs.x1}, ${coords.abs.y1}, ${coords.abs.x2}, ${yOff})`);
      }
    }
    // console.log(e);
  }, false)
})
