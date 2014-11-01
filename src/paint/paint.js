var c = "#000000";
// var coment = document.getElementById('xy');

console.log("start");

var canvas = document.getElementById("a_canvas");
var xy = document.getElementById("xy");
var ctx = canvas.getContext("2d");

ctx.lineWidth = 5;

//cpick
var selected = document.getElementById('t4');

//モード
var mode = 0;

function saveFile (filename, canvas){
	var a = document.createElement('a'),
		e = document.createEvent('MouseEvents');
	e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.dispatchEvent(e);
}

var bold = document.getElementById("bold");
bold.onmousedown = function() {
	ctx.lineWidth += 10;
}

var thin = document.getElementById("thin");
thin.onmousedown = function() {
	if (ctx.lineWidth != 5) {
		ctx.lineWidth -= 10;
	}
}

var pen = document.getElementById("pencil");
pen.onmousedown = function() {
	mode = 0;
}

var erase = document.getElementById("eraser");
erase.onmousedown = function() {
	mode = 1;
}

var save = document.getElementById("save");
save.onmousedown = function() {
	/* canvasの描画結果をPNGで取り出しimg要素にセット */
try {
 /* var img_png_src = canvas.toDataURL();
  document.getElementById("image_png").src = img_png_src;
  document.getElementById("data_url_png").firstChild.nodeValue = img_png_src; 
  */
	
  saveFile("image_png", canvas);  
} catch(e) {
  document.getElementById("image_png").alt = "未対応";
}
}

	
canvas.width = 600;
canvas.height = 450;

var flag = 0;

var ArX = new Array();
var ArY = new Array();

//マウスを押すorタッチでset関数に行く
canvas.onmousedown = set;

//マウスがクリックされてたらdrawLineに行く
canvas.onmousemove = drawLine;
//canvas.ontouchmove = drawLine;

//マウスor指が離れたらend関数へ
canvas.onmouseup = end;
canvas.onmouseout = end;

function set(event) {
	console.log("set");
	flag = 1;
	//var c = .style.background;
	console.log(c);
	ctx.strokeStyle = c;
	//消しゴム処理
	ctx.globalCompositeOperation = "source-over";
	if(mode == 1){
		ctx.globalCompositeOperation = "destination-out"
	}
}

function end(event) {
	// console.log("end");
	flag = 0;
	ArX = [];
	ArY = [];
}

function drawLine(event){
	event.preventDefault();	
	if(flag == 1){
		var mx = event.pageX-$(canvas).position().left;
		var my = event.pageY-$(canvas).position().top;
		ArX.push(mx);
		ArY.push(my);
		ctx.beginPath();
		ctx.moveTo(ArX[ArX.length-2],ArY[ArY.length-2]);
		ctx.lineTo(ArX[ArX.length-1],ArY[ArY.length-1]);
		ctx.lineCap = "round";
		ctx.stroke();
	}
}

$("#colorchange").click(
	function() {
		$("#colormenu").toggle();
	}
)

$(".color-candidate").css({cursor: 'pointer'});


$(".color-candidate").click(function() {
	c = $(this).attr('data-color');
})

