/** @williamadowling:
https://forums.adobe.com/message/8185738#8185738
**/


function align(){
    var myDoc = app.activeDocument;
    var aB = myDoc.artboards;
    var layers = myDoc.layers;



    for(var a = 0; a < aB.length; a++){
        var masks = [];
        myDoc.selection = null;
        aB.setActiveArtboardIndex(a);
        myDoc.selectObjectsOnActiveArtboard();


        var reference; // this is the object we wan to align to.. AKA Key object
        var obj; // this is the object we want to align.
        var items = myDoc.selection;


        var topLayer = layers[0];
        var botLayer = layers[1];





        if (topLayer =! null || botLayer =! null){
            for (var b = 0; b < 2; b++){
                if(items[b].layer == botLayer){
                    reference = items[b];
                }
                else if(items[b].layer = topLayer){
                    obj = items[b];
                }
            }


            //recursive function digs into groupItems to find all
            //clipping masks present on the current artboard.
            //pushes all clipping masks to 'masks' array.
            function findClips(thisGroup){
                var item;
                for (var b = 0; b < thisGroup.pageItems.length; b++){
                    item = thisGroup.pageItems[b];
                    if(item.clipping){
                        masks.push(item);
                    }
                }
                if (thisGroup.groupItems.length>0){
                    for (var b = 0; b < thisGroup.groupItems.length; b++){
                        var inGroup = thisGroup.groupItems[b];
                        findClips(inGroup);
                    }
                }


            }


            //searches masks array for the clipping mask with highest top value
            function findTop(masks){
                var topMost;
                for(var b = 0; b < masks.length; b++){
                    if(b == 0){
                        topMost = masks[b];
                    }
                    else if (masks[b].top > topMost.top){
                        topMost = masks[b];
                    }
                }
                return topMost.top;
            }


            //searches masks array for clipping mask with farthest left value
            function findLeft(masks){
                var leftMost;
                for(var b = 0; b < masks.length; b++){
                    if(b == 0){
                        leftMost = masks[b];
                    }
                    else if(masks[b].left < leftMost.left){
                        leftMost = masks[b];
                    }
                }
                return leftMost.left;
            }


            //populate masks array
            findClips(obj);


            //find highest and farthest left clipping mask coordinates
            var clipLeft = findLeft(masks);
            var clipTop = findTop(masks);



            //determines the extraneous, invisible, extra art
            //on the left side and top of the objects so that
            //that measurement can be ignored during placement
            var objExtraLeft = clipLeft - obj.left;
            var objExtraTop = obj.top - clipTop;




            //determine top and left coordinates for object
            //to be aligned.
            var left = reference.left - objExtraLeft;
            var top = reference.top + objExtraTop;


            //move object to be aligned into position
            obj.left = left;
            obj.top = top;

        }
        else{
            alert("You're missing a layer!");
        }
    }
}
// align();
