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
  x:null,
  y:null,
  w:null,
  h:null
};

for (var e in input) {
  input[e] = this[e];
}


loadUniversalJSXLibraries();
console.log(`Loading for ${appName}`);
loadJSX(`align.jsx`);
loadJSX(`${appName}.jsx`);
console.log(appUI);
var scanRes;
scanningToggle(true);



function scanningToggle(state) {
  var res, here;
  var parm = ["x", "y", "w", "h"];
	if (state) {
		timer = setInterval(function(){csInterface.evalScript('selectScanner();', function(a){
      if (a == scanRes) return;
      if (a > 0) {
        // csInterface.evalScript(`getBounds(selection, 'geometricBounds')`, function(e){
        csInterface.evalScript(`getBoundingBox()`, function(e){
          // console.log(e);
          res = e.split(",");
          for (var m = 0; m < res.length; m++) {
            here = parm[m];
            console.log(`${here}:${res[m]}`);
            if (res[m] < 0)
            res[m] = res[m]*(-1);
            input[here].value = res[m];
          };
        })

        // sNode.NW.style.borderColor = appUI.color.Focus;
        // sNode.NE.style.borderColor = appUI.color.Focus;
        // sNode.SW.style.borderColor = appUI.color.Focus;
        // sNode.SE.style.borderColor = appUI.color.Focus;
        sNode.Center.style.borderColor = appUI.color.Focus;
        sNode.boundBox.style.borderColor = appUI.color.Focus;
      } else {
        res = ["", "", "", ""];
        // sNode.NW.style.borderColor = appUI.color.Border;
        // sNode.NE.style.borderColor = appUI.color.Border;
        // sNode.SW.style.borderColor = appUI.color.Border;
        // sNode.SE.style.borderColor = appUI.color.Border;
        sNode.Center.style.borderColor = appUI.color.Border;
        sNode.boundBox.style.borderColor = appUI.color.Border;
        console.log("Nothing selected");
      }
      for (var m = 0; m < res.length; m++) {
        here = parm[m];
        console.log(`${here}:${res[m]}`);
        input[here].value = res[m];
      };
      scanRes = a;
    })}, 50);
		console.log("Scanning on");
	} else {
		clearInterval(timer);
		console.log("Scanning off");
	}
}
