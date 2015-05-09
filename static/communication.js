var signalingChannel, key, id,
    //haveLocalMedia = false,
    weWaited = false,
    state="s",
    enemystate="s",
    receiveChannel,
    sendChannel,
    queryparams,
    fireCount=0,
    //ifFire=false;
   // myVideoStream, myVideo, 
    //yourVideoStream, yourVideo,
    doNothing = function() {},
    pc,
    constraints = {mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true}};


  window.onload = function () {

  // auto-connect signaling channel if key provided in URI
  if (queryparams && queryparams['key']) {
    document.getElementById("key").value = queryparams['key'];
    connect();
  }

 // myVideo = document.getElementById("myVideo");
 // yourVideo = document.getElementById("yourVideo");
  
  //getMedia();

  //  connect() calls createPC() when connected.
  //  attachMedia() is called when both createPC() and getMedia()
  //  have succeeded.
};


function connect() {
  document.getElementById("connect").style.display='none';
  var errorCB, scHandlers, handleMsg;

  // First, get the key used to connect
  key = document.getElementById("key").value;

  // This is the handler for all messages received on the
  // signaling channel.
  handleMsg = function (msg) {
    // First, we clean up the message and post it on-screen
    //var msgE = document.getElementById("inmessages");
    //var msgString = JSON.stringify(msg).replace(/\\r\\n/g,'\n');
    //msgE.value = msgString + "\n" + msgE.value;

    // Then, we take action based on the kind of message
    if (msg.type === "offer") {
      pc.setRemoteDescription(new RTCSessionDescription(msg));
      answer();
      //document.getElementById("call").style.display="none";
     
    } else if (msg.type === "answer") {
      pc.setRemoteDescription(new RTCSessionDescription(msg));
     // document.getElementById("call").style.display="none";
      // document.getElementById("connect").style.display="none";

     // activateKey();
    } else if (msg.type === "candidate") {
      pc.addIceCandidate(
        new RTCIceCandidate({sdpMLineIndex:msg.mlineindex,
                             candidate:msg.candidate}));
    }
  
  };

  // handlers for signaling channel
  scHandlers = {
    'onWaiting' : function () {
      setStatus("Waiting");
      // weWaited will be used later for auto-call
      weWaited = true;
      //document.getElementById("connect").style.display="none";
      //document.getElementById("hint").innerHTML="Give your partner this link: http://nodejs-ypan16.rhcloud.com/tank2.html?key="+key;
      document.getElementById("hint").innerHTML="Give your partner the same key as yours.";
      mine=0;
      enemy=1;
    },
    'onConnected': function () {
      setStatus("Connected");
      // set up the RTC Peer Connection since we're connected
     // send({side:1});
      createPC();
      createChannel();
      // activateKey();
      if(!weWaited)
        call();
      //document.getElementById("call").style.display="inline";
      //call();
    },
    'onMessage': handleMsg
  };

  // Finally, create signaling channel
  signalingChannel = createSignalingChannel(key, scHandlers);
  errorCB = function (msg) {
    document.getElementById("response").innerHTML = msg;
  };

  // and connect.
  signalingChannel.connect(errorCB);
}



function send(msg) {
  var handler = function (res) {
    document.getElementById("response").innerHTML = res;
    return;
  },

  // Get message if not passed in
  msg = msg || "";//document.getElementById("message").value"";

  // Clean it up and post it on-screen
  //msgE = document.getElementById("outmessages");
  //var msgString = JSON.stringify(msg).replace(/\\r\\n/g,'\n');
  //msgE.value = msgString + "\n" + msgE.value;

  // and send on signaling channel
  signalingChannel.send(msg, handler);
}



function createPC() {
  var stunuri = true,
      turnuri = true,
      myfalse = function(v) {
                  return ((v==="0")||(v==="false")||(!v)); },
      config = new Array();

  // adjust config string based on any query params
  if (queryparams) {
    if ('stunuri' in queryparams) {
      stunuri = !myfalse(queryparams['stunuri']);
    }
    if ('turnuri' in queryparams) {
      turnuri = !myfalse(queryparams['turnuri']);
    };
  };

  if (stunuri) {
    // this is one of Google's public STUN servers
    config.push({"url":"stun:stun.l.google.com:19302"});
  }
  if (turnuri) {
    if (stunuri) {
      // can't use TURN-only TURN server in this case because of
      // bug in Chrome that causes STUN server responses to be
      // ignored, so we use TURN server that also does STUN
      config.push({"url":"turn:user@turn.webrtcbook.com",
             "credential":"test"});
      /* config.push({
      'url': 'turn:146.148.80.209:3478?transport=udp',
      "password": "KAwVq/0jk885bgz4pLp4geMNPno=",
      "username": "1426137134:543308582"});*/
       /*
      config.push({
      'url': 'turn:192.158.29.39:3478?transport=udp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'});
      config.push({
      'url': 'turn:192.158.29.39:3478?transport=tcp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'});*/
    
    } else {
      // this is our TURN-only TURN server
    /*  config.push({
      'url': 'turn:146.148.80.209:3478?transport=udp',
      "password": "KAwVq/0jk885bgz4pLp4geMNPno=",
      "username": "1426137134:543308582"});*/
      config.push({"url":"turn:user@turn-only.webrtcbook.com",
                "credential":"test"});
    }
  }
  console.log("config = " + JSON.stringify(config));

  pc = new RTCPeerConnection({iceServers:config});
  pc.onicecandidate = onIceCandidate;

  //pc.onaddstream = onRemoteStreamAdded;
  //pc.onremovestream = onRemoteStreamRemoved;

  // wait for local media to be ready
  //attachMediaIfReady();
}


function onIceCandidate(e) {
  if (e.candidate) {
    send({type:  'candidate',
          mlineindex:  e.candidate.sdpMLineIndex,
          candidate:  e.candidate.candidate});
  }
}

function call() {
  pc.createOffer(gotDescription, doNothing, constraints);
}

// and this generates it for an answer.
function answer() {
  pc.createAnswer(gotDescription, doNothing, constraints);
}

function gotDescription(localDesc) {
  pc.setLocalDescription(localDesc);
  send(localDesc);
}


function setStatus(str) {
  
}

function createChannel(){

pc.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event){
    //document.querySelector("div#receive").innerHTML = event.data;

    var data=JSON.parse(event.data);
     if(data.newShot){
      //var ox=(tanks[enemy].currentPoints[12].x+tanks[enemy].currentPoints[13].x)/2;
      //var oy=(tanks[enemy].currentPoints[1].y+tanks[enemy].currentPoints[2].y)/2;
      var ox=data.ox;
      var oy=data.oy;
      var d=data.d;
      //tanks[enemy].score=data.myscore;
     
      
     shots.push(new myObjects.shot(ox,oy,d,tanks[enemy].color));
     document.getElementById("fire").currentTime=0;
      document.getElementById("fire").play();
   }
    else if(data.myscore<=100)
     tanks[mine].score=data.myscore;
   else{
    tanks[enemy].state=data.state;
    tanks[enemy].originX=data.X;
    tanks[enemy].originY=data.Y;
    tanks[enemy].d=data.d;
  }
    
   
   // e=event;
    //console.log(JSON.stringify(event.data));
    getPos=true;
  };
};

sendChannel = pc.createDataChannel("sendDataChannel", {reliable: true});
sendChannel.onopen=  function(){document.getElementById("hint").innerHTML="You are ready!"; activateKey();};

}
function deactivateKey(){
   document.getElementById("bd").onkeydown=function(){};
   document.getElementById("bd").onkeyup=function(){};
}

function activateKey(){
    document.getElementById("bd").onkeydown=function(event){
      var ifopen=false;
      if(sendChannel.readyState==='open')
        ifopen=true;

      
      
          if (event.keyCode == 38) {
                    
                      
                     // sendChannel.send("1111");
                     if( tanks[mine].setArrow("u")){
                       // console.info(tank1.arrow);
                        if(ifopen)
                       sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                     }
                     
                      //console.info({'state':state,'X':posX,'Y':posY});
                    }
          else if(event.keyCode == 40){
                   
                
                   if( tanks[mine].setArrow("d")){
                       
                        if(ifopen)
                      sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                       }
                      
                  }
           else if(event.keyCode == 37){
                    
                   if( tanks[mine].setArrow("l")){
                       
                        if(ifopen)
                      sendChannel.send(JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                  }
                }
          else if(event.keyCode == 39){
           
                  if( tanks[mine].setArrow("r")){
                        
                        if(ifopen)
                        sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));}
                  }



           

        
         //fireCount++;
              
          };

document.getElementById("bd").onkeyup=function(event){
    var ifopen=false;
      if(sendChannel.readyState==='open')
        ifopen=true;
     
          if (event.keyCode == 38 ) {
                     
                      tanks[mine].unsetArrow("u");

                      //sendChannel.send("11111");
                       if(ifopen)
                       sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                   }
          else if(event.keyCode == 40){

                     tanks[mine].unsetArrow("d");
                      //sendChannel.send("11111");
                      if(ifopen)
                      sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                       }
          else if (event.keyCode == 37 ){
                    tanks[mine].unsetArrow("l");
                      //sendChannel.send("11111");
                      if(ifopen)
                      sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                       }
          else if( event.keyCode == 39){
                       tanks[mine].unsetArrow("r");
                      //sendChannel.send("11111");
                      if(ifopen)
                       sendChannel.send( JSON.stringify({'state':tanks[mine].state,'X':tanks[mine].originX,'Y':tanks[mine].originY,'d':tanks[mine].d}));
                        }
            
           else if(event.keyCode == 32 ){
                      //ifFire=true;
                      

                     var ox=tanks[mine].originX;
                     var oy=tanks[mine].originY;

                     //var ox=(tanks[mine].currentPoints[12].x+tanks[mine].currentPoints[13].x)/2;
                     //var oy=(tanks[mine].currentPoints[1].y+tanks[mine].currentPoints[2].y)/2;
           
                    shots.push(new myObjects.shot(ox,oy,tanks[mine].d,tanks[mine].color));
                    document.getElementById("fire").currentTime=0;
                    document.getElementById("fire").play();
                        
                        if(ifopen)//add one shot
                       sendChannel.send( JSON.stringify({'newShot':true,'ox':tanks[mine].originX,'oy':tanks[mine].originY,'d':tanks[mine].d}));
                    }   
   
 };

}
