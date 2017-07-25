$(document).ready(function () {
    var link = "http://158.108.165.223/data/kaiseed/"
    var state_bed = 0;
    var auto_bed = 0;
    //up-down bed
    setInterval(function () {
        if (auto_bed == 1) {
            console.log("auto");
            if (state_bed == 0) {
                $.ajax({
                    url: link + "motion/"
                }).done(function (data) {
                    if (data == 1) {
                        state_bed = 1;
                        $.ajax({
                            url: link + "motor/set/" + state_bed
                        }).done(function () {
                        }).fail(function () {
                        })
                    }
                }).fail(function (data) {
                    console.log(data);
                })
            }
            else if (state_bed == 1) {
                $.ajax({
                    url: link + "ultra/"
                }).done(function (data) {
                    if (data == 0) {
                        state_bed = 0;
                        $.ajax({
                            url: link + "motor/set/" + state_bed
                        }).done(function () {
                        }).fail(function () {
                        })
                    }

                }).fail(function (data) {
                    console.log(data);
                })
            }
            $('#state').append(state_bed);
        }

    }, 1000 * 2);
    //pee
    var alert_humidity = 0;
    setInterval(function () {
        if (alert_humidity == 0) {
            $.ajax({
                url: link + "humidity/"
            }).done(function (data) {
                if (data > 20) {
                    alert("Alert");
                    alert_humidity = 1;
                }
            }).fail(function (data) {
                console.log(data);
            })
        }
        else {
            setTimeout(function () { alert_humidity = 0 }, 5000);
        }
    }, 1000 * 2)
    //sound
    //index[0] = normal index[1] = sick index[2] = hungry index[3] = wet
    var status = [0, 0, 0, 0]
    var normal_mood = "5555555555";
    var sick_mood = "4444444444";
    var hungry_mood = "6666666666";
    var wet_mood = "7777777777";
    var current = "";
    var soundArr = [1, 2, 3, 4];
    var mood = ["happy", "sick", "hungry", "wet"];
    setInterval(function () {
        if (current.length <= 10) {
            $.ajax({
                url: link + "sound/"
            }).done(function (data) {
                current += Math.floor(data / 113);
            }).fail(function () {
            })
        }
        else {
            for (var i = 0; i < 10; i++) {
                status[0] += Math.abs(parseInt(normal_mood[i]) - parseInt(current[i]));
                status[1] += Math.abs(parseInt(sick_mood[i]) - parseInt(current[i]));
                status[2] += Math.abs(parseInt(hungry_mood[i]) - parseInt(current[i]));
                status[3] += Math.abs(parseInt(wet_mood[i]) - parseInt(current[i]));
            }
            $("#current").append(current);
            $("#status").append(status);
            var min = 100;
            var ind = 0;
            for (var i = 0; i < status.length; i++) {
                if (status[i] < min) {
                    min = status[i];
                    ind = i;
                }
            }
            soundArr[ind] += 1;
            status[0] = 0;
            status[1] = 0;
            status[2] = 0;
            status[3] = 0;
            current = "";
            $("#mood").append(mood[ind]);
        }
        $("#happy").append(soundArr[0]);
        $("#sick").append(soundArr[1]);
        $("#hungry").append(soundArr[2]);
        $("#wet").append(soundArr[3]);
    }, 1000 * 2)
    var click = 0;
    $('#clickauto').click(function () {
        auto_bed = 1;
        $.ajax({
            url: link + "command/set/" + auto_bed
        }).done(function () {
        }).fail(function () {
        })
    })
    $('#clickmanual').click(function () {
        console.log("manual");
        auto_bed = 0;
        $.ajax({
            url: link + "command/set/" + auto_bed
        }).done(function () {
        }).fail(function () {
        })
    })
    if (auto_bed == 0) {
        $('#click').click(function () {
            if (state_bed == 0) {
                state_bed = 1;
                $.ajax({
                    url: link + "motor/set/" + state_bed
                }).done(function () {
                }).fail(function () {
                })
            }
            else if (state_bed == 1) {
                state_bed = 0;
                $.ajax({
                    url: link + "motor/set/" + state_bed
                }).done(function () {
                }).fail(function () {
                })
            }
            console.log(state_bed);
        })
    }


})  
