var canvas = document.getElementById('myCanvas');

if (canvas.getContext) {
    var context = canvas.getContext('2d');
}

//var vx = 10,
  //  vy = -10,
   // gravity = 1;


    //var r=10;
    //var posX = r;
    //var posY = r;
    //var enemyPosX=r;
    //var enemyPosY=r;
    // var vX=0,vY=0,enemyVX=0,enemyVY=0;
     var getPos=false;
     var playonce=0;
     //var arrow={u:0,r:0,d:0,l:0};
     var mine=1;
     var enemy=0;
     var t=0;
    
    var tanks=[];
      tanks[0]=new myObjects.tank(50,canvas.height/2,"blue");
      tanks[1]=new myObjects.tank(canvas.width-50,canvas.height/2,"red");

     var walls=[];
     walls.push(new myObjects.wall(new myObjects.point(200,100),canvas.width-200*2,40));
     walls.push(new myObjects.wall(new myObjects.point(200,canvas.height-100-40),canvas.width-200*2,40));

     walls.push(new myObjects.wall(new myObjects.point(100,190),40,canvas.height-190*2));
     walls.push(new myObjects.wall(new myObjects.point(canvas.width-100-40,190),40,canvas.height-190*2));

     walls.push(new myObjects.wall(new myObjects.point(canvas.width/2-30,canvas.height/2-30),60,60));
     //var ro=0;

     var shots=[];
     var endMarks=[];
     endMarks.push(new myObjects.endMark("You Win!"));
     endMarks.push(new myObjects.endMark("You Lose!"));


//main game loop 

setInterval(function() {

    //if(t%2===0 && sendChannel && sendChannel.readyState==='open')
       //sendChannel.send( JSON.stringify({'myscore':tanks[mine].score}));
    context.fillStyle = "#F0F0F0";
    context.fillRect(0,0,canvas.width, canvas.height);  


     
  
     context.globalAlpha=1;
    
      shots.forEach(function(elem){
      elem.move();
      
      elem.render(context);
    });

   tanks[mine].traces.push(new myObjects.trace(tanks[mine].currentPoints));
    tanks[enemy].traces.push(new myObjects.trace(tanks[enemy].currentPoints));

    //render traces for each tank
     for(var m=0;m<=1;m++){
       tanks[m].traces.forEach(function(elem){
          if(elem.alpha<0){
           var i=tanks[m].traces.indexOf(elem);
           tanks[m].traces.splice(i,1);
          }
          else
            elem.render(context);

       });

     }


   // if(ro%6==0)
    tanks[mine].rotate();
    tanks[mine].move();
    //tanks[mine].collisionTest();
    tanks[mine].render(context);

    tanks[enemy].rotate();
    tanks[enemy].move();
    //tanks[enemy].collisionTest();
    tanks[enemy].render(context);

    walls[0].render(context);
    walls[1].render(context);
    walls[2].render(context);
    walls[3].render(context);
    walls[4].render(context);

     //render marks for each tank

     for(var m=0;m<=1;m++){
      tanks[m].marks.forEach(function(elem){
      
         if(elem.alpha<0){
           //console.info("remove");
           var i=tanks[m].marks.indexOf(elem);
           tanks[m].marks.splice(i,1);
         }
         else
         elem.render(context);
       });
      
    }

   
   //judge if the game is over
    if(tanks[mine].score<=0){//you lose
      if(endMarks[1].timer<=150){
        if(playonce===0)
        document.getElementById("lose").play();
        playonce=1;
        
        deactivateKey();
       endMarks[1].render(context);
     }
      else{
        t=0;
        playonce=0;
        activateKey();
        endMarks[1].timer=0;
        //tanks[0].originX=50;
        //tanks[0].originY=canvas.height/2;
        //tanks[1].originX=canvas.width-50;
        //tanks[1].originY=canvas.height/2;
        tanks[0]=new myObjects.tank(50,canvas.height/2,"blue");
        tanks[1]=new myObjects.tank(canvas.width-50,canvas.height/2,"red");
        
      }
    }
       
    else if(tanks[enemy].score<=0){//you win
      if(endMarks[0].timer<=150){
         if(playonce===0)
        document.getElementById("win").play();
        playonce=1;

         deactivateKey();
       endMarks[0].render(context);
     }
      else{
        t=0;
        playonce=0;
        activateKey();
        endMarks[0].timer=0;
       // tanks[0].originX=50;
        //tanks[0].originY=canvas.height/2;
        //tanks[1].originX=canvas.width-50;
        //tanks[1].originY=canvas.height/2;
        tanks[0]=new myObjects.tank(50,canvas.height/2,"blue");
        tanks[1]=new myObjects.tank(canvas.width-50,canvas.height/2,"red");
      }
    }
    //ro=(ro+1)%120;

     
}, 30);