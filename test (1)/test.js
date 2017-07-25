$(document).ready(function(){
    var link = "http://158.108.165.223/data/kaiseed/"
    var state_bed = 0;
    var auto_bed = 0;
    //up-down bed
    setInterval(function(){
        if(auto_bed==1){
            if(state_bed==0){
                $.ajax({
                    url : link + "motion/"
                }).done(function(data){
                    if(data==1){
                        state_bed = 1;
                        $.ajax({
                            url: link+"motor/set/"+state_bed
                        }).done(function(){
                        }).fail(function(){
                        })
                    }
                }).fail(function(data){
                    console.log(data);
                })
            }
            else if(state_bed == 1){
                $.ajax({
                    url : link + "ultra/"
                }).done(function(data){
                    if(data==0){
                        state_bed = 0;
                        $.ajax({
                            url: link+"motor/set/"+state_bed
                        }).done(function(){
                        }).fail(function(){
                        })
                    }
                    
                }).fail(function(data){
                    console.log(data);
                })
            }
            $('#state').append(state_bed);
        }
        
    },1000*2);
    //pee
    var alert_humidity = 0;
    setInterval(function(){
        $("#alert").append(alert_humidity);
        if (alert_humidity==0){
            $.ajax({
                url : link + "humidity/"
            }).done(function(data){
                if(data>100){
                    alert("Alert");
                    alert_humidity = 1;
                }
            }).fail(function(data){
                console.log(data);
            })
        }
        else{
            setTimeout(function(){ alert_humidity = 0 }, 20000);
        }
    },1000*2)
    //sound
    //index[0] = normal index[1] = sick index[2] = hungry index[3] = wet
    var status = [0,0,0,0]
    var normal_mood = "3874623856";
    var sick_mood = "4444444444";
    var hungry_mood = "2834783874";
    var wet_mood = "2384971203";
    var current = "";
    var soundArr = [0,0,0,0];
        setInterval(function(){
            if(current.length<=10){
                $.ajax({
                    url : link + "sound/"
                }).done(function(data){
                    current+=Math.floor(data/113);
                    $("#data").append( )
                }).fail(function(){
                })
            }
            else{
                for(var i = 0;i<10;i++){
                    status[0]+=Math.abs(parseInt(normal_mood[i])-parseInt(current[i]));
                    status[1]+=Math.abs(parseInt(sick_mood[i])-parseInt(current[i]));
                    status[2]+=Math.abs(parseInt(hungry_mood[i])-parseInt(current[i]));
                    status[3]+=Math.abs(parseInt(wet_mood[i])-parseInt(current[i]));
                }
                var min = 100;
                var ind = 0;
                for (var i = 0;i<status.length;i++){
                    if(status[i]<min){
                        min = status[i];
                        ind = i;
                    }
                }
                soundArr[ind]+=1;
                status = [0,0,0,0];
                current = "";
            }
            $("#data1").append(soundArr[0]);
            $("#data2").append(soundArr[1]);
            $("#data3").append(soundArr[2]);
            $("#data4").append(soundArr[3]);
        },1000*2)
    
     $('#click').click(function(){
         if(state_bed == 0&&auto_bed ==1){
             auto_bed = 0;
             console.log("click");
         }
         else{
             switch_bed = 0;
         }
        }) 


})  
