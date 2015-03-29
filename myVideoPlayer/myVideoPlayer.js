(function (myVideoPlayer, $, undefined){

  //myVideoPlayer.newVideoList=[];
  myVideoPlayer.watchedVideos={};
  myVideoPlayer.mainVideo={};
  myVideoPlayer.videos={};
  myVideoPlayer.displaydesc=false;
  myVideoPlayer.isTheater=false;

  myVideoPlayer.rawData=[];

  myVideoPlayer.start=function(dataurlForJsonFile){
    myVideoPlayer.getVideos(dataurlForJsonFile);
    

  };

  myVideoPlayer.videoItem=function(name,description,contentURL,thumbURL){
        this.name=name;
        this.description=description;
        this.contentURL=contentURL;
        this.thumbURL=thumbURL;
        this.current=0;
  };

    myVideoPlayer.getVideos=function(dataurlForJsonFile){

      myVideoPlayer.watchedVideos=JSON.parse(localStorage.getItem("watchedVideos"));
        if(myVideoPlayer.watchedVideos==null)
            myVideoPlayer.watchedVideos={};
          //console.info("good");
     //make an ajax call and wait for success
      $.ajax({url:dataurlForJsonFile}).success(function(data) {
         
         myVideoPlayer.rawData=data;
          $.each(data,function(i,video){
            myVideoPlayer.videos[video.id]=new myVideoPlayer.videoItem(video["name"],video["description"],video["content-url"],video["thumb-url"]);
            //console.info(myVideoPlayer.videos[video.id]);
          });

       for(var key in myVideoPlayer.videos){
        if(myVideoPlayer.watchedVideos[key])
          myVideoPlayer.videos[key]=myVideoPlayer.watchedVideos[key];
         }

       myVideoPlayer.getMainVideo();
       myVideoPlayer.render();
    myVideoPlayer.setEventsCallback();

      });
  
    };
   

    myVideoPlayer.getMainVideo=function(){
      myVideoPlayer.mainVideo=JSON.parse(localStorage.getItem("mainVideo"));
      if(myVideoPlayer.mainVideo==null)
        myVideoPlayer.mainVideo={};
      var id=myVideoPlayer.mainVideo["id"];


        
        if(!myVideoPlayer.videos[id])//if mainvideo not exist in videos
        {
           //console.info(myVideoPlayer.videos);
              for(var key in myVideoPlayer.videos){
              //find the first one not watched to be the main
               //console.info("no");
                if(!myVideoPlayer.watchedVideos[key]){
                 
                      myVideoPlayer.mainVideo=myVideoPlayer.videos[key];
                      myVideoPlayer.mainVideo["id"]=key;
                       break;
                }

         }
      }
       id=myVideoPlayer.mainVideo["id"];

         if(!myVideoPlayer.videos[id]){
             for(var key in myVideoPlayer.videos){//find the first one  watched to be the main
                if(myVideoPlayer.watchedVideos[key]){
                       myVideoPlayer.mainVideo=myVideoPlayer.videos[key];
                       myVideoPlayer.mainVideo["id"]=key;
                        break;
                } 
              }
         }
      
    };

      myVideoPlayer.clickThumb=function(){
        //var img=this.
          //console.info("111");
           // myVideoPlayer.displaydesc=false;
           myVideoPlayer.mainVideo=myVideoPlayer.videos[this.id];
           myVideoPlayer.mainVideo["id"]=this.id;
           console.info(this.id);

     
          //myVideoPlayer.watchedVideos[this.id]=myVideoPlayer.videos[this.id];
          //localStorage.setItem("watchedVideos",JSON.stringify(myVideoPlayer.watchedVideos));
          localStorage.setItem("mainVideo",JSON.stringify(myVideoPlayer.mainVideo));
          myVideoPlayer.render();
         
         
         // $("#mainVideo")[0].play();


    };

    myVideoPlayer.render=function(){
      $("#description")[0].innerHTML=myVideoPlayer.mainVideo.description;

        $("#mainVideo")[0].src=myVideoPlayer.mainVideo.contentURL;
      $("#mainVideo")[0].currentTime=myVideoPlayer.mainVideo.current;
     // $("#description").removeClass("display");
      //console.info(myVideoPlayer.mainVideo.current);

       $("#playOrPause span")[0].className="glyphicon glyphicon-play";
      $("#progress")[0].style.width=String($(".hook")[0].clientWidth-100)+"px";
     //$("#controls")[0].style.top=String($("#mainVideo")[0].clientHeight-50)+"px";
    
   // console.info( String($("#mainVideo")[0].clientHeight-50)+"px");
      $("#mainVideo")[0].src=myVideoPlayer.mainVideo.contentURL;
     //console.info(myVideoPlayer.mainvideo.contentURL);
     //$("#description").removeClass("display");
     $(".hook")[0].removeChild($("#thumbContainer")[0]);

    
    if(myVideoPlayer.isTheater)
      $(".hook")[0].appendChild($("<div id='thumbContainer' class='theater'></div>")[0]);
    else
      $(".hook")[0].appendChild($("<div id='thumbContainer'></div>")[0]);
   

      for(var key in myVideoPlayer.videos){//first append unwatched videos
        if(!myVideoPlayer.watchedVideos[key] && myVideoPlayer.mainVideo["id"]!=key){
         // console.info("good");
          var img=$("<img/>");
           
            img[0].src=myVideoPlayer.videos[key].thumbURL;
            //console.info($(".hook"));
            var container=$("<div class='thumbSmallContainer' style='display:inline-block; width:25%; position:relative'></div>");
            container[0].id=key;
          container.append(img);

            container[0].onclick=myVideoPlayer.clickThumb;
          var playmark=$("<img src='playicon.png' class='playmark' style='position:absolute'/>");
          playmark[0].style.width="40%";

           playmark[0].style.top=String((1-0.7333*0.4*168/109)/2*100)+"%";
          playmark[0].style.left="30%";
          // console.info(playmark[0].clientWidth);

             container.append(playmark);
            $("#thumbContainer").append(container);

        }

      }
       for(var key in myVideoPlayer.videos){//then append watched videos
        if(myVideoPlayer.watchedVideos[key]  && myVideoPlayer.mainVideo["id"]!=key){
         var img=$("<img/>");
            
            //img[0].onclick=myVideoPlayer.clickThumb;
            img[0].src=myVideoPlayer.videos[key].thumbURL;

             var container=$("<div class='thumbSmallContainer' style='display:inline-block; width:25%; position:relative'></div>");
             container[0].id=key;

          container.append(img);
           container[0].onclick=myVideoPlayer.clickThumb;
          var playmark=$("<img src='playicon.png' class='playmark' style='position:absolute'/>");
          playmark[0].style.width="40%";

          playmark[0].style.top=String((1-0.7333*0.4*168/109)/2*100)+"%";
          playmark[0].style.left="30%";
           //console.info(playmark[0].clientWidth);

             container.append(playmark);
            $("#thumbContainer").append(container);
            //$("#thumbContainer").append(img);
        }

      }

      $(".thumbSmallContainer").on("mouseover",function(){
           this.getElementsByClassName("playmark")[0].className="playmark display";
           //console.info("in");
       });

        
       $(".thumbSmallContainer").on("mouseout",function(){
           this.getElementsByClassName("playmark")[0].className="playmark";
           //console.info("out");
       });


    };
  myVideoPlayer.setEventsCallback=function(){

      $("body")[0].onresize=function(){
       // console.info("111");
          $("#progress")[0].style.width=String($(".hook")[0].clientWidth-100)+"px";
          //deconsole.info($("#progress")[0].style.width);
        //   $("#controls")[0].style.top=String($("#mainVideo")[0].clientHeight-50)+"px";
      };

      setInterval(function(){
        myVideoPlayer.mainVideo.current=$("#mainVideo")[0].currentTime;
       $("#progress")[0].style.width=String($(".hook")[0].clientWidth-100)+"px";
       var length=String($("#mainVideo")[0].currentTime/$("#mainVideo")[0].duration*100)+"%";
           $("#progressBar").css("width",length);

           if($("#mainVideo")[0].currentTime/$("#mainVideo")[0].duration>=0.25 && myVideoPlayer.displaydesc==false){
              myVideoPlayer.displaydesc=true;
              $("#description").addClass("display");
              $("#description")[0].innerHTML=myVideoPlayer.mainVideo.description;

           }

            else if($("#mainVideo")[0].currentTime/$("#mainVideo")[0].duration<0.25 && myVideoPlayer.displaydesc==true){
              myVideoPlayer.displaydesc=false;
              $("#description").removeClass("display");
             // $("#description")[0].innerHTML=myVideoPlayer.mainVideo.description;

           }

           for(var i=0;i<$("#mainVideo")[0].buffered.length;i++){

            if($("#mainVideo")[0].buffered.start(i)<=$("#mainVideo")[0].currentTime && $("#mainVideo")[0].buffered.end(i)>=$("#mainVideo")[0].currentTime){
              var l=($("#mainVideo")[0].buffered.end(i)-$("#mainVideo")[0].currentTime)/$("#mainVideo")[0].duration*$("#progress")[0].clientWidth;
              $("#bufferedBar")[0].style.width=String(l)+"px";
              //console.info($("#bufferedBar")[0].style.width);
            }
           }

       },30);
      

       setInterval(function(){
                 localStorage.setItem("watchedVideos",JSON.stringify(myVideoPlayer.watchedVideos));
                localStorage.setItem("mainVideo",JSON.stringify(myVideoPlayer.mainVideo));
       


       },2000);
       
       $("#progress")[0].onclick=function(e){
         var x=e.clientX;
        // myVideoPlayer.displaydesc=false;
         //$("#description").removeClass("display");
        // if(myVideoPlayer.isTheater)
            var cur=x-(window.innerWidth-$(".hook")[0].clientWidth)/2-50;
     
         $("#mainVideo")[0].currentTime=$("#mainVideo")[0].duration*cur/this.clientWidth;

       };

       $("#playOrPause")[0].onclick=function(){
         if($("#mainVideo")[0].paused){
           $("#mainVideo")[0].play();
           myVideoPlayer.watchedVideos[myVideoPlayer.mainVideo.id]=myVideoPlayer.mainVideo;
           $("#playOrPause span").removeClass("glyphicon-play");
           $("#playOrPause span").addClass("glyphicon-pause");
         }
         else{
           $("#mainVideo")[0].pause();
           $("#playOrPause span").removeClass("glyphicon-pause");
           $("#playOrPause span").addClass("glyphicon-play");
         }
       };

       $("#mainVideo")[0].onclick=function(){
         if($("#mainVideo")[0].paused){
           $("#mainVideo")[0].play();
           myVideoPlayer.watchedVideos[myVideoPlayer.mainVideo.id]=myVideoPlayer.mainVideo;
           $("#playOrPause span").removeClass("glyphicon-play");
           $("#playOrPause span").addClass("glyphicon-pause");
         }
         else{
           $("#mainVideo")[0].pause();
           $("#playOrPause span").removeClass("glyphicon-pause");
           $("#playOrPause span").addClass("glyphicon-play");
         }
       };

       $("#theater")[0].onclick=function(){
         //$("body").css("background-color","black");
         if(myVideoPlayer.isTheater){
           $(".hook").removeClass("theater");
           $("#theater span").removeClass("glyphicon-unchecked");
           $("#theater span").addClass("glyphicon-fullscreen");
           myVideoPlayer.isTheater=false;
           $("body").removeClass("theater");
           
           $("#thumbContainer").removeClass("theater");
          }
         else{
           $(".hook").addClass("theater");
           $("#theater span").removeClass("glyphicon-fullscreen");
           $("#theater span").addClass("glyphicon-unchecked");
           myVideoPlayer.isTheater=true;
           $("body").addClass("theater");
             
             $("#thumbContainer").addClass("theater");
         }
       };


       $("#mainVideo")[0].ondblclick=function(){
          if(myVideoPlayer.isTheater){
           $(".hook").removeClass("theater");
           $("#theater span").removeClass("glyphicon-unchecked");
           $("#theater span").addClass("glyphicon-fullscreen");
           myVideoPlayer.isTheater=false;
           $("body").removeClass("theater");
           
           $("#thumbContainer").removeClass("theater");
          }
         else{
           $(".hook").addClass("theater");
           $("#theater span").removeClass("glyphicon-fullscreen");
           $("#theater span").addClass("glyphicon-unchecked");
           myVideoPlayer.isTheater=true;
           $("body").addClass("theater");
             
             $("#thumbContainer").addClass("theater");
         }
       };

       $("body")[0].onkeydown=function(e){
          if(e.keyCode == 27 && myVideoPlayer.isTheater) {
             $(".hook").removeClass("theater");
           $("#theater span").removeClass("glyphicon-unchecked");
           $("#theater span").addClass("glyphicon-fullscreen");
           myVideoPlayer.isTheater=false;
           $("body").removeClass("theater");
           
           $("#thumbContainer").removeClass("theater");

          }
       };

       $("#mainVideo")[0].onended=function(){
        

         myVideoPlayer.mainVideo.current=0;
         myVideoPlayer.mainVideo=myVideoPlayer.videos[$(".hook .thumbSmallContainer")[0].id];
         myVideoPlayer.mainVideo["id"]=$(".hook .thumbSmallContainer")[0].id;
          //$("#mainVideo")[0].src=myVideoPlayer.mainVideo.contentURL;
          //$("#mainVideo")[0].currentTime=myVideoPlayer.mainVideo.current;
          //myVideoPlayer.watchedVideos[$(".hook .thumbSmallContainer")[0].id]=myVideoPlayer.videos[$(".hook .thumbSmallContainer")[0].id];
           //localStorage.setItem("watchedVideos",JSON.stringify(myVideoPlayer.watchedVideos));
           localStorage.setItem("mainVideo",JSON.stringify(myVideoPlayer.mainVideo));
          myVideoPlayer.render();
          //$("#mainVideo")[0].play();
       };

       $("#videoContainer")[0].onmouseover=function(){
           $("#controls").addClass("display");
           //console.info("in");
       };

        $("#videoContainer")[0].onmouseout=function(){
           $("#controls").removeClass("display");
       };



       

       

    };  
     

})(window.myVideoPlayer = window.myVideoPlayer || {}, jQuery)