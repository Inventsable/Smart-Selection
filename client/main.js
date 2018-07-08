var csInterface = new CSInterface();
var appSkin = csInterface.hostEnvironment.appSkinInfo;
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";
var hostPath = sysPath + "/host/";
var appName = csInterface.hostEnvironment.appName;


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
  },
  abs : {
    x1:null,
    y1:null,
    x2:null,
    y2:null,
    w:null,
    h:null,
  },
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
  var parm = ["x1", "y1", "w", "h"];
  // var parm = ["aW", "aH"]
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
          input.aW.value = parseInt(res[2]);
          input.aH.value = parseInt(res[3]);
          coords.artB.x2 = parseInt(coords.artB.x1) + parseInt(coords.artB.w);
          coords.artB.y2 = parseInt(coords.artB.y1) + parseInt(coords.artB.h);
          console.log(coords.artB);
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
  if (a > 0) {
    csInterface.evalScript(`getBounds(selection, 'geometricBounds')`, function(e){
      // csInterface.evalScript(`getBoundingBox()`, function(e){
      type = e.split(";")
      res = type[0].split(",");
      for (var m = 0; m < res.length; m++) {
        if (res[m] == null) {
          continue;
        }
        here = parm[m];
        coords.rel[here] = parseInt(res[m]);
        input[here].value = parseInt(res[m]);
      };
      absRes = type[1].split(",");
      for (var m = 0; m < absRes.length; m++) {
        if (res[m] == null) {
          break;
        }
        here = parm[m];
        coords.abs[here] = parseInt(absRes[m])
      };
      console.log(coords.rel);
      console.log(coords.abs);
    })
    sNode.NW.style.borderColor = appUI.color.Focus;
    sNode.SE.style.borderColor = appUI.color.Focus;
    sNode.boundBox.style.borderColor = appUI.color.Focus;
  } else {
    res = ["", "", "", "", "", ""];
    sNode.NW.style.borderColor = appUI.color.Border;
    sNode.SE.style.borderColor = appUI.color.Border;
    sNode.boundBox.style.borderColor = appUI.color.Border;
    // console.log("Nothing selected");
  }
  try {
    for (var m = 0; m < res.length; m++) {
      here = parm[m];
      input[here].value = res[m];
    };
  } catch(e){return}
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
  }, false)
})

// var nodeN = document.getElementById('N');
