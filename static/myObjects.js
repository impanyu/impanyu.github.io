(function (myObjects, $, undefined) {

    pi=3.1415926;
    pi360=2*pi/360;


     //point object definition
   myObjects.point=function(x,y){
     this.x=x;
     this.y=y;

   };

   

   myObjects.collisionTest=function(keyPoints){
          //keyPoints=[1,2,3,4,12,13,16,17,18,19,20];
          flag=false;//if need to redo coordinates transform
         //boundary collision test
        if(this.originX<40|| this.originX>canvas.width-40 || this.originY<40 || this.originY>canvas.height-40 ){
         for(var i=0;i<=keyPoints.length-1;i++){
         	if(this.currentPoints[keyPoints[i]].x<=0){       		
         		this.originX=this.originX+(-this.currentPoints[keyPoints[i]].x);
         		flag=true;
         		//currentPoints[keyPoints[i]].x=0;
         	}
         	if(this.currentPoints[keyPoints[i]].x>=canvas.width){       		
         		this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-canvas.width);
         		flag=true;
         		//currentPoints[keyPoints[i]].x=canvas.width;
         	}
           if(this.currentPoints[keyPoints[i]].y>=canvas.height){       		
         		this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-canvas.height);
         		flag=true;
         		//currentPoints[keyPoints[i]].y=canvas.height;
         	}
            if(this.currentPoints[keyPoints[i]].y<=0){       		
         		this.originY=this.originY+(-this.currentPoints[keyPoints[i]].y);
         		flag=true;
         		//currentPoints[keyPoints[i]].y=0;
         	}
         }
     }

      flag2=false;
     	//wall collision test
     	//walls.forEach(function(elem){
     		for(var k=0;k<=walls.length-1;k++){
     			var elem=walls[k];
              for(var i=0;i<=keyPoints.length-1;i++){
              	//console.info(this.originY);

              	//console.info("1");
              	var dis=15;
     	 	         if(this.currentPoints[keyPoints[i]].x<=elem.v2.x-dis && this.currentPoints[keyPoints[i]].x>=elem.v.x+dis
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v.y && this.currentPoints[keyPoints[i]].y<=elem.v.y+dis){
     	 	         	 //console.info(this.originY);

                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v.y);
                         //console.info(this.originY);

         		         flag2=true;
     	 	         }
     	 	         if(this.currentPoints[keyPoints[i]].x<=elem.v2.x-dis && this.currentPoints[keyPoints[i]].x>=elem.v.x+dis 
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v2.y-dis && this.currentPoints[keyPoints[i]].y<=elem.v2.y){
                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v2.y);
         		         flag2=true;
     	 	         }
     	 	        if(this.currentPoints[keyPoints[i]].y<=elem.v2.y-dis && this.currentPoints[keyPoints[i]].y>=elem.v.y+dis 
     	 	         	 && this.currentPoints[keyPoints[i]].x>=elem.v.x && this.currentPoints[keyPoints[i]].x<=elem.v.x+dis){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v.x);
         		         flag2=true;
     	 	         }
     	 	        if(this.currentPoints[keyPoints[i]].y<=elem.v2.y-dis && this.currentPoints[keyPoints[i]].y>=elem.v.y+dis
     	 	         	 && this.currentPoints[keyPoints[i]].x>=elem.v2.x-dis && this.currentPoints[keyPoints[i]].x<=elem.v2.x){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v2.x);
         		         flag2=true;
     	 	         }

     	 	         if(this.currentPoints[keyPoints[i]].x<=elem.v.x+dis && this.currentPoints[keyPoints[i]].x>=elem.v.x
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v.y && this.currentPoints[keyPoints[i]].y<=elem.v.y+dis){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v.x);
                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v.y);
         		         flag2=true;
     	 	         }
     	 	          if(this.currentPoints[keyPoints[i]].x<=elem.v2.x && this.currentPoints[keyPoints[i]].x>=elem.v2.x-dis
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v.y && this.currentPoints[keyPoints[i]].y<=elem.v.y+dis){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v2.x);
                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v.y);
         		         flag2=true;
     	 	         }
     	 	          if(this.currentPoints[keyPoints[i]].x<=elem.v.x+dis && this.currentPoints[keyPoints[i]].x>=elem.v.x
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v2.y-dis && this.currentPoints[keyPoints[i]].y<=elem.v2.y){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v.x);
                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v2.y);
         		         flag2=true;
     	 	         }
     	 	          if(this.currentPoints[keyPoints[i]].x<=elem.v2.x && this.currentPoints[keyPoints[i]].x>=elem.v2.x-dis
     	 	         	 && this.currentPoints[keyPoints[i]].y>=elem.v2.y-dis && this.currentPoints[keyPoints[i]].y<=elem.v2.y){
                         this.originX=this.originX-(this.currentPoints[keyPoints[i]].x-elem.v2.x);
                         this.originY=this.originY-(this.currentPoints[keyPoints[i]].y-elem.v2.y);
         		         flag2=true;
     	 	         }

     	 }
     	 if(flag2)
     	 	break;

     	}
         flag=flag||flag2;
        return flag;

     };


     //key points:1,2,3,4,12,13
     myObjects.tankPoints=[];
     myObjects.tankPoints[0]=new myObjects.point(3,20);
     myObjects.tankPoints[1]=new myObjects.point(15,20);
     myObjects.tankPoints[2]=new myObjects.point(15,-20);
     myObjects.tankPoints[3]=new myObjects.point(-15,-20);
     myObjects.tankPoints[4]=new myObjects.point(-15,20);
     myObjects.tankPoints[5]=new myObjects.point(-3,20);

     myObjects.tankPoints[6]=new myObjects.point(3,10);
     myObjects.tankPoints[7]=new myObjects.point(8,10);
     myObjects.tankPoints[8]=new myObjects.point(8,-10);
     myObjects.tankPoints[9]=new myObjects.point(-8,-10);
     myObjects.tankPoints[10]=new myObjects.point(-8,10);
     myObjects.tankPoints[11]=new myObjects.point(-3,10);

     myObjects.tankPoints[12]=new myObjects.point(-3,40);
     myObjects.tankPoints[13]=new myObjects.point(3,40);
     myObjects.tankPoints[14]=new myObjects.point(3,5);
     myObjects.tankPoints[15]=new myObjects.point(-3,5); 

    myObjects.tankPoints[16]=new myObjects.point(-5,-20);
    myObjects.tankPoints[17]=new myObjects.point(5,-20);
    myObjects.tankPoints[18]=new myObjects.point(15,-20);
    myObjects.tankPoints[19]=new myObjects.point(3,30); 
    myObjects.tankPoints[20]=new myObjects.point(-3,30);

     myObjects.tankPoints360=[];
     myObjects.tankPoints360[0]=myObjects.tankPoints;
     for(var angel=5;angel<360;angel+=5){
     	myObjects.tankPoints360[angel/5]=[];
     	for(var i=0;i<=20;i++){
     		myObjects.tankPoints360[angel/5][i]=new myObjects.point(0,0);
     		myObjects.tankPoints360[angel/5][i].x=Math.cos(angel*pi360)*myObjects.tankPoints360[0][i].x-Math.sin(angel*pi360)*myObjects.tankPoints360[0][i].y;
     		myObjects.tankPoints360[angel/5][i].y=Math.sin(angel*pi360)*myObjects.tankPoints360[0][i].x+Math.cos(angel*pi360)*myObjects.tankPoints360[0][i].y;
     	}
     }

     myObjects.shotPoints=[];
     myObjects.shotPoints[0]=new myObjects.point(0,40);
     myObjects.shotPoints[1]=new myObjects.point(3,37);
     myObjects.shotPoints[2]=new myObjects.point(3,32);
     myObjects.shotPoints[3]=new myObjects.point(-3,32);
     myObjects.shotPoints[4]=new myObjects.point(-3,37);

     myObjects.shotPoints360=[];
     myObjects.shotPoints360[0]=myObjects.shotPoints;
     for(var angel=5;angel<360;angel+=5){
     	myObjects.shotPoints360[angel/5]=[];
     	for(var i=0;i<=4;i++){
     		myObjects.shotPoints360[angel/5][i]=new myObjects.point(0,0);
     		myObjects.shotPoints360[angel/5][i].x=Math.cos(angel*pi360)*myObjects.shotPoints360[0][i].x-Math.sin(angel*pi360)*myObjects.shotPoints360[0][i].y;
     		myObjects.shotPoints360[angel/5][i].y=Math.sin(angel*pi360)*myObjects.shotPoints360[0][i].x+Math.cos(angel*pi360)*myObjects.shotPoints360[0][i].y;
     	}
     }



   //tank obejct definition
   myObjects.tank=function(x,y,color){
   	this.marks=[];
     this.originX=x;
     this.originY=y;
     this.d=180;//angel of tank coordinate
     this.color=color;
     this.score=100;
     this.traces=[];
      this.currentPoints=[];
         for(var i=0;i<=20;i++){
    	    this.currentPoints[i]=new myObjects.point(0,0);
        }

     //this.prePoints=[];

     //this.ro=0;
     this.v=5;
     this.anV=5;
     //this.currentPoints=[];
     this.arrow={u:0,r:0,d:0,l:0};
     this.state=['s','s'];

     this.setArrow=function(s){
        
         if(this.arrow[s]===0){
         	
             // ro=0;
            // console.info("this.arrow");
            this.arrow[s]=1;
            if(s==='u' || s==='d')
              this.state[0]=s;
            else
              this.state[1]=s;
            return true;
         }
          else
          return false;
      };

     this.unsetArrow=function(s){
         this.arrow[s]=0;
         if(s==="u" ||s=="d"){
           if(this.arrow["u"]===1){
         	this.state[0]="u";
         	 return;
           }  
           if(this.arrow["d"]===1){
         	this.state[0]="d";
         	  return;
           }
           this.state[0]="s";

        }
        else{

           if(this.arrow["r"]===1){
            	this.state[1]="r";
             	
         	   return;
           }
       
          if(this.arrow["l"]===1){
         	this.state[1]="l";
         	
         	return;
          }
          this.state[1]="s";
        }
        //this.state=["s","s"];
      };

     this.rotate=function(){
        if(this.state[1]==="r")
        	this.d=(this.d+this.anV)%360;
        else if(this.state[1]==="l"){
        	this.d-=this.anV;
        	//console.info(this.d);
        	if(this.d<0)
        	this.d+=360;
        }
     };

     this.move=function(){       
       if(this.state[0]==='u'){
          this.originX+=this.v*Math.cos(pi360*this.d+pi/2);
          this.originY+=this.v*Math.sin(this.d*pi360+pi/2);
       }
       else if(this.state[0]==='d'){
          this.originX-=this.v*Math.cos(this.d*pi360+pi/2);
          this.originY-=this.v*Math.sin(this.d*pi360+pi/2);
       }
       //
       //move each marks accordingly
       this.marks.forEach(function(elem){
            elem.x=this.originX;
            //console.info(elem.x);
            elem.y=this.originY;
       },this);
     };

   
   
     //draw the tank on canvas
     this.render=function(ctx){
           
           //coordinates transform
     	   //var currentPoints=[];
     	    
     	   for(var i=0;i<=20;i++){
     	   	// currentPoints[i]=new myObjects.point(0,0);
     	   	 this.currentPoints[i].x=myObjects.tankPoints360[this.d/5][i].x+this.originX;
     	   	 this.currentPoints[i].y=myObjects.tankPoints360[this.d/5][i].y+this.originY;
     	   }
     	   //console.info(currentPoints[0].x);
     	   keyPoints=[1,2,3,4,12,13,16,17,18,19,20];
     	   var flag=false;
     	   flag=myObjects.collisionTest.call(this,keyPoints);

     	   //redo coordinates transform
           if(flag){
           	//console.info("1");
         	
           for(var i=0;i<=15;i++){
     	   	// currentPoints[i]=new myObjects.point(0,0);
     	   	 this.currentPoints[i].x=myObjects.tankPoints360[this.d/5][i].x+this.originX;
     	   	 this.currentPoints[i].y=myObjects.tankPoints360[this.d/5][i].y+this.originY;
     	   }
     	}





           ctx.lineWidth=2;
           ctx.strokeStyle="#000000";
           ctx.fillStyle=this.color;

           if(this.score>=0){
          var right=new myObjects.point((this.currentPoints[1].x-this.currentPoints[2].x)*(this.score/100)+this.currentPoints[2].x,
           	                              (this.currentPoints[1].y-this.currentPoints[2].y)*(this.score/100)+this.currentPoints[2].y);
          var left=new myObjects.point((this.currentPoints[4].x-this.currentPoints[3].x)*(this.score/100)+this.currentPoints[3].x,
           	                              (this.currentPoints[4].y-this.currentPoints[3].y)*(this.score/100)+this.currentPoints[3].y);
           ctx.beginPath();
           ctx.moveTo(right.x,right.y);
           ctx.lineTo(this.currentPoints[2].x,this.currentPoints[2].y);
           ctx.lineTo(this.currentPoints[3].x,this.currentPoints[3].y);
           ctx.lineTo(left.x,left.y);
           ctx.fill();
       }

           ctx.beginPath();
           ctx.moveTo(this.currentPoints[0].x,this.currentPoints[0].y);
           ctx.lineTo(this.currentPoints[1].x,this.currentPoints[1].y);
           ctx.lineTo(this.currentPoints[2].x,this.currentPoints[2].y);
           ctx.lineTo(this.currentPoints[3].x,this.currentPoints[3].y);
           ctx.lineTo(this.currentPoints[4].x,this.currentPoints[4].y);
           ctx.lineTo(this.currentPoints[5].x,this.currentPoints[5].y);
           //ctx.closePath();
           //ctx.fill();
           ctx.stroke();

         


           ctx.beginPath();
           ctx.fillStyle="white";
           ctx.moveTo(this.currentPoints[6].x,this.currentPoints[6].y);
           ctx.lineTo(this.currentPoints[7].x,this.currentPoints[7].y);
           ctx.lineTo(this.currentPoints[8].x,this.currentPoints[8].y);
           ctx.lineTo(this.currentPoints[9].x,this.currentPoints[9].y);
           ctx.lineTo(this.currentPoints[10].x,this.currentPoints[10].y);
           ctx.lineTo(this.currentPoints[11].x,this.currentPoints[11].y);
           //ctx.fill();
           //ctx.stroke();


            //ctx.beginPath();

           ctx.moveTo(this.currentPoints[12].x,this.currentPoints[12].y);
           ctx.lineTo(this.currentPoints[13].x,this.currentPoints[13].y);
           ctx.lineTo(this.currentPoints[14].x,this.currentPoints[14].y);
           ctx.lineTo(this.currentPoints[15].x,this.currentPoints[15].y);
           ctx.closePath();
           ctx.fill();
           ctx.stroke();
     };

   };
      //definition of wall object
      myObjects.wall=function(v,width,height){
           this.v=v;
           this.width=width;
           this.height=height;
           this.v2=new myObjects.point(v.x+width,v.y+height);

           this.render=function(ctx){
             ctx.fillStyle="#909090";
             ctx.fillRect(v.x,v.y,width,height);
             ctx.strokeStyle="#000000";
             //ctx.st
             ctx.strokeRect(v.x,v.y,width,height);

           };

      };


      //definition of canon shot
      myObjects.shot=function(x,y,d,color){
          this.originX=x;
          this.originY=y;
          this.d=d;//angel of tank coordinate
          this.color=color;
          this.v=15;
          this.currentPoints=[];
         for(var i=0;i<=4;i++){
    	    this.currentPoints[i]=new myObjects.point(0,0);
        }

            this.move=function(){      
                 this.originX+=this.v*Math.cos(pi360*this.d+pi/2);
                 this.originY+=this.v*Math.sin(this.d*pi360+pi/2);         
             };

          this.collisionTest=function(){
          	    if(this.color===tanks[enemy].color){
                  if(this.currentPoints[0].x-tanks[mine].originX<=15 && this.currentPoints[0].x-tanks[mine].originX>=-15 
                  	&&this.currentPoints[0].y-tanks[mine].originY<=15 && this.currentPoints[0].y-tanks[mine].originY>=-15 ){
                  	  tanks[mine].marks.push(new myObjects.mark(tanks[mine].originX,tanks[mine].originY));
                  	  //tanks[mine].score-=5;
                  	  //sendChannel.send( JSON.stringify({'myscore':tanks[mine].score}));
                  	  return true;
                    }
                  	  // tanks[mine].marks.push(new myObjects.mark(100,100));
          	    }
          	    else{
          	    	if(this.currentPoints[0].x-tanks[enemy].originX<=15 && this.currentPoints[0].x-tanks[enemy].originX>=-15 
                  	&&this.currentPoints[0].y-tanks[enemy].originY<=15 && this.currentPoints[0].y-tanks[enemy].originY>=-15 ){
                  	  tanks[enemy].marks.push(new myObjects.mark(tanks[enemy].originX,tanks[enemy].originY));
                  	  tanks[enemy].score-=5;
                  	   sendChannel.send( JSON.stringify({'myscore':tanks[enemy].score}));
                  	  return true;
                  	}
          	    }
          	    return false;

          	    
          };


          this.render=function(ctx){
            // var currentPoints=[];
     	    
     	     for(var i=0;i<=4;i++){
     	   	 //currentPoints[i]=new myObjects.point(0,0);
     	   	 this.currentPoints[i].x=myObjects.shotPoints360[this.d/5][i].x+this.originX;
     	   	 this.currentPoints[i].y=myObjects.shotPoints360[this.d/5][i].y+this.originY;
     	   }
     	   keyPoints=[0];
     	     var flag=myObjects.collisionTest.call(this,keyPoints);

     	      
               flag=flag || this.collisionTest();
           if(flag){
         	    var i=shots.indexOf(this);
                shots.splice(i,1);
     	    }


             ctx.lineWidth=2;
             ctx.strokeStyle="#000000";
             ctx.fillStyle=this.color;
             ctx.beginPath();
             ctx.moveTo(this.currentPoints[0].x,this.currentPoints[0].y);
             ctx.lineTo(this.currentPoints[1].x,this.currentPoints[1].y);
             ctx.lineTo(this.currentPoints[2].x,this.currentPoints[2].y);
             ctx.lineTo(this.currentPoints[3].x,this.currentPoints[3].y);
             ctx.lineTo(this.currentPoints[4].x,this.currentPoints[4].y);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();

          };


      };

       //definition of shot mark
      myObjects.mark=function(x,y){
         this.x=x;
         this.y=y;
         this.h=0;
         this.alpha=1.0;

         this.render=function(ctx){
             ctx.fillStyle="red";
             //ctx.strokeStyle="black";
             ctx.font="Bold 20px Arial";
             ctx.globalAlpha=this.alpha;
             ctx.fillText("-5",this.x,this.y-this.h);
             
             this.h+=2;
             this.alpha-=0.05;
              console.info(this.alpha);

             //ctx.strokeText("-5",x,y);

         };

      };

     myObjects.endMark=function(wol){
     	this.mark=wol;
     	this.timer=0;
        this.render=function(ctx){
        	ctx.globalAlpha=1;
            ctx.fillStyle="#0066FF";
            ctx.font="Bold 150px Courier";
            ctx.fillText(this.mark,100,300);
            ctx.strokeText(this.mark,100,300);
            this.timer++;
        };
     };


  
     myObjects.trace=function(currentPoints){
        this.currentPoints=currentPoints;
        this.RS=new myObjects.point(this.currentPoints[2].x,this.currentPoints[2].y);
        this.RE=new myObjects.point(this.currentPoints[2].x+(this.currentPoints[1].x-this.currentPoints[2].x)*0.1,
        	        this.currentPoints[2].y+(this.currentPoints[1].y-this.currentPoints[2].y)*0.1);
        this.LS=new myObjects.point(this.currentPoints[3].x,this.currentPoints[3].y);
        this.LE=new myObjects.point(this.currentPoints[3].x+(this.currentPoints[4].x-this.currentPoints[3].x)*0.1,
        	        this.currentPoints[3].y+(this.currentPoints[4].y-this.currentPoints[3].y)*0.1);

     	this.alpha=1;
     	this.render=function(ctx){
             ctx.lineWidth=2;
             ctx.strokeStyle="#909090";
             ctx.globalAlpha=this.alpha;
            
             ctx.beginPath();
             ctx.moveTo(this.RS.x,this.RS.y);
             ctx.lineTo(this.RE.x,this.RE.y);

             ctx.moveTo(this.LS.x,this.LS.y);
             ctx.lineTo(this.LE.x,this.LE.y);

             ctx.stroke();

             this.alpha-=0.01;


     	};

     };




	})(window.myObjects = window.myObjects || {}, jQuery) 