$(function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var borderWidth = 10;
  var isDrawing = false;
  ctx.lineWidth = 10;
  $('#colormenu').hide();
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#ffffff'
  ctx.fillRect(0, 0, 600, 450);

  $('#canvas')
    .on('touchstart mousedown', function(e){
        e.preventDefault();
        thisX = e.pageX || e.originalEvent.changedTouches[0].pageX;
        thisY = e.pageY || e.originalEvent.changedTouches[0].pageY;
        startX = thisX - $(this).offset().left - borderWidth;
        startY = thisY - $(this).offset().top - borderWidth;
        isDrawing = true;
    })
    .on('touchmove mousemove',function(e){
        if(!isDrawing) return;
        e.preventDefault();
        thisX = e.pageX || e.originalEvent.changedTouches[0].pageX;
        thisY = e.pageY || e.originalEvent.changedTouches[0].pageY;
        x = thisX - $(this).offset().left - borderWidth;
        y = thisY - $(this).offset().top - borderWidth;
        ctx.beginPath();
        ctx.lineCap = "round"
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX = x;
        startY = y;
    })
    .on('touchend mouseup', function(){
        isDrawing = false;
    })
    .on('touchleave mouseleave', function(e){
        if(!isDrawing) return;
        e.preventDefault();
        thisX = e.pageX || e.originalEvent.changedTouches[0].pageX;
        thisY = e.pageY || e.originalEvent.changedTouches[0].pageY;
        x = thisX - $(this).offset().left - borderWidth;
        y = thisY - $(this).offset().top - borderWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX = x;
        startY = y;
        isDrawing = false;
    });

  $('#post').click(function(){
      canvas = $('#canvas')[0].toDataURL();
      $.ajax({
          type: 'POST',
          url: 'http://makky.io:3000/pictures',
          data: {
              picture: {
                body: canvas
              }
          },
          success:function(data, dataType){
            alert('完成しました！');
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 600, 450);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('完成しました！');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 600, 450);
          }
          
      });
  });

  $('#pencil').click(function(){
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 10;
  });

  $('#eraser').click(function(){
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 30;
  });

  $('#bold').click(function(){
    if(ctx.lineWidth < 80){
      ctx.lineWidth += 10;
    }
  });

  $('#thin').click(function(){
    if(ctx.lineWidth >= 5){
      ctx.lineWidth -= 10;
    }
  });

  $('#colorchange').click(function(){
    $('#colormenu').toggle();
  });

  $('.color-candidate').click(function(){
    ctx.strokeStyle = $(this).attr('data-color');
  })
});