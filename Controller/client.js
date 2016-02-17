
function com(come){
  if (typeof com.mode === 'undefined') {
        com.mode = 0;
  }
  if (typeof com.fb === 'undefined') {
        com.fb = false;
  }
  if (typeof com.fb === 'undefined') {
        com.sp = false;
  }
  if (typeof com.br === 'undefined') {
        com.br = true;
  }

  if (typeof com.br === 'undefined') {
        com.br = true;
  }

  if (typeof com.crsv1 === 'undefined') {
        com.crsv1 = 90;
  }
  if (typeof com.crsv2 === 'undefined') {
        com.crsv2 = 90;
  }

  if (com.mode == 0){
    if (come === 67) {
      com.mode = 1;
    }else if(come === 90){
      com.fb = !com.fb;
    }else if(come === 38){
      if(com.sp<10) com.sp += 1;
    }else if(come === 40){
      if(com.sp>0) com.sp -= 1;
    }

    if (come === 32) {
      com.br = false;
    }

    if(com.br == true){
      socket.emit('command', {
        action: 'post',
        com:'0',
        subcom:'0'
      });
    }else{
      if(com.fb == true){
        socket.emit('command', {
          action: 'post',
          com:'1',
          subcom:com.sp+''
        });
      }else{
        socket.emit('command', {
          action: 'post',
          com:'2',
          subcom:com.sp+''
        });
      }
    }

    if (come === 39) {
      socket.emit('command', {
        action: 'post',
        com:'4',
        subcom:'0'
      });
    }else if(come === 37){
      socket.emit('command', {
        action: 'post',
        com:'5',
        subcom:'0'
      });
    }else{
      socket.emit('command', {
        action: 'post',
        com:'3',
        subcom:'0'
      });
    }



  }else{
    if (come === 88) {
      com.crsv1 = 90;
      com.crsv2 = 90;
    }else if (come === 38) {
      com.crsv1 += 1;
    }else if (come === 40) {
      com.crsv1 -= 1;
    }else if (come === 37) {
      com.crsv2 += 1;
    }else if (come === 39) {
      com.crsv2 -= 1;
    }
    socket.emit('command', {
        action: 'post',
        com:'7',
        subcom:com.crsv1 + ''
    });

    socket.emit('command', {
        action: 'post',
        com:'8',
        subcom:com.crsv2 + ''
    });
  }


}

$(document).ready(function() {
  $('#text').keydown(function(event) {


    console.log('push');
    com(event.keyCode);
  });
});