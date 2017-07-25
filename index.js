var myChart;
$(document).ready(function () {
    var link = "http://158.108.165.223/data/kaiseed/"
    var state_bed = 0;
    var auto_bed = 0;
    //up-down bed
    setInterval(function () {
        if (auto_bed == 1) {
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
                    url: link + "motion/"
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
    if (alert_humidity == 0) {
        setInterval(function () {
            $.ajax({
                url: link + "humidity/"
            }).done(function (data) {
                $(".humidity").text(data + "%");
                if (data > 20) {
                    alert("Humidity Alert, Please Check Your Baby!");
                    alert_humidity = 1;
                }
            }).fail(function (data) {
                console.log(data);
            })
        }, 1000 * 2)
    } else {
        setTimeout(function () { alert_humidity = 0 }, 5000);
    }
    //sound
    //index[0] = normal index[1] = sick index[2] = hungry index[3] = wet

    var status = [0, 0, 0, 0]
    var normal_mood = "0000000000";
    var sick_mood = "8888888888";
    var hungry_mood = "5555555555";
    var wet_mood = "2222222222";
    var current = "";
    var soundArr = [1, 0, 0, 0];
    var mood = ["normal", "sick", "hungry", "wet"];
    function updatechart() {
        var ctx = document.getElementById("myChart");
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [soundArr[0], soundArr[1], soundArr[2], soundArr[3]],
                    backgroundColor: [
                        '#2ecc71',
                        '#ffd480',
                        'brown',
                        '#8e44ad',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 0

                }],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'NORMAL',
                    'SICK',
                    'HUNGRY',
                    'WET'
                ]
            },

        });

    }

    updatechart();
    setInterval(function () {
        if (current.length <= 10) {
            $.ajax({
                url: link + "sound/"
            }).done(function (data) {
                current += Math.floor(data / 113);
                $("#data").append()
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
            var min = 100;
            var ind = 0;
            for (var i = 0; i < status.length; i++) {
                if (status[i] < min) {
                    min = status[i];
                    ind = i;
                }
            }
            soundArr[ind] += 1;
            status = [0, 0, 0, 0];
            current = "";
            $(".mood-status").text(mood[ind]);
            $(".mood").attr("src", "emote/" + mood[ind] + ".png");
            updatechart();
            console.log(ind);
        }
        $("#data1").text(soundArr[0]);
        $("#data2").text(soundArr[1]);
        $("#data3").text(soundArr[2]);
        $("#data4").text(soundArr[3]);
        // myChart.data.datasets[0] = soundArr[0];

    }, 1000 * 2)

    var click = 0;
    var toggle = true;
    $.ajax({
        url: link + "command/"
    }).done(function (data) {
        if (data) {
            $('#command').click();
        }
    }).fail(function () {
    })
    $('#command').click(function () {
        if (toggle) {
            auto_bed = 1;
            $.ajax({
                url: link + "command/set/" + auto_bed
            }).done(function () {
            }).fail(function () {
            })
            toggle = false;
        } else {
            auto_bed = 0;
            $.ajax({
                url: link + "command/set/" + auto_bed
            }).done(function () {
            }).fail(function () {
            })
            toggle = true;
        }
    })
    //manual
    if (auto_bed == 0) {
        $('#img').click(function () {
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
