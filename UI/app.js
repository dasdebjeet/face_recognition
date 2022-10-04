$(document).ready(() => {
    const celeb_json = JSON.stringify(celeb_data)
    let celeb_obj = JSON.parse(celeb_json)
    // console.log(celeb_obj.celeb)

    $(".dropzone_container_overlay").click(() => {
        $(".img_inp").trigger("click")
    })

    var server_data = ""
    document.querySelectorAll(".img_inp").forEach(inputElement => {
        const dropZoneElement = inputElement.closest(".dropzone_wrapper")

        dropZoneElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            $(".dropzone_container").addClass("dropzone_active")
            $(".dropzone_container_icon").html("<i class='far fa-check'></i>")
            $(".dropzone_container_text").text("Selected")
        })

        var remove_dropzone_active = () => {
            $(".dropzone_container").removeClass("dropzone_active")
            $(".dropzone_container_icon").html("<i class='fal fa-arrow-to-top'></i>")
            $(".dropzone_container_text").text("Drop file here or browse")
        };

        ["dragleave", "dragend"].forEach(type => {
            dropZoneElement.addEventListener(type, (e) => {
                remove_dropzone_active()
            })
        })


        const sendData = (files) => {
            if (files.length) {
                // console.log(files)

                inputElement = files
                var file = files[0]

                blog_thumbnail_name = file.name
                const reader = new FileReader();

                let file_name = file.name; //getting file name
                if (file_name.length >= 14) { //if file name length is greater than 14 then split it and add ...
                    let split_name = file_name.split('.');
                    file_name = split_name[0].substring(0, 8) + "..." + split_name[1]
                }

                reader.readAsDataURL(file);
                reader.onload = () => {
                    data_url = (reader.result)
                    // console.log(data_url)
                    server_data = data_url

                    $(".dropzone_container_thumbnail").css({
                        'background': "url(" + data_url + ") no-repeat center",
                        'background-size': "cover"
                    })

                };
            };
        }



        dropZoneElement.addEventListener("drop", (e) => {
            e.preventDefault(); // prevent the image from opening in a new tab
            // console.log(e.dataTransfer)
            if (e.dataTransfer.files.length) {
                var image = e.dataTransfer.files
                sendData(image)
            }
            remove_dropzone_active()
        });



        // //main blog image upload input
        $(".img_inp").on('change', (e) => {
            // $(".thumbnail_error_msg").css("display", 'none')
            var files = e.target.files;
            sendData(files)
        })


    });

    var errorMsg_display = (msg) => {
        $(".classification_error_msg").html(msg)
        // $(".classification_error").css("transform", 'translateY(800%)')
        $(".classification_error").css("bottom", '5%')


        setTimeout(() => {
            $(".classification_error").css("bottom", '-10%')
        }, 5000)

        $(".dropzone_container").removeClass("dropzoneAniC")
    }

    $(".classify_btn").click(() => {


        if (!server_data == "") {
            try {
                $(".dropzone_container").addClass("dropzoneAniC")

                $.post("http://127.0.0.1:5000/classify_image", {
                    image_data: server_data
                }, function (data, status) {
                    console.log(data.length, status)
                    if (!data || data.length == 0) {
                        errorMsg_display("Can't detect eyes or face, try another image")
                        return
                    }
                    console.log(data)
                    $(".classified_details_modal_wrap").css('transform', "translateY(0%)");
                    $(".classified_details_img").html('<img src="' + server_data + '">')





                    let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];

                    let match = null;
                    let bestScore = -1;
                    for (let i = 0; i < data.length; ++i) {
                        let maxScoreForThisClass = Math.max(...data[i].class_probability);
                        if (maxScoreForThisClass > bestScore) {
                            match = data[i];
                            bestScore = maxScoreForThisClass;
                        }
                    }

                    // console.log(bestScore, match)

                    if (match) {
                        var name = (match.class)
                        var n_name = name.replace("_", " ")

                        $(".classified_details_name").text(n_name)
                        $(".classified_details_accuracy_score").text(bestScore)

                        $("div[data_content='" + name + "']").addClass("matched_face")

                        var celeb_len = celeb_obj.celeb.length
                        var search_jsn = (name) => {
                            for (var i = 0; i < celeb_len; i++) {
                                if (celeb_obj.celeb[i].name == name) {
                                    var json_celeb = celeb_obj.celeb[i].name
                                    // console.log(json_celeb)
                                    return i
                                }
                            }
                        }
                        var jsn_indx = search_jsn(name)
                        if (jsn_indx >= 0) {
                            $(".classified_details_age").text(celeb_obj.celeb[jsn_indx].age)
                            $(".classified_details_profession").text(celeb_obj.celeb[jsn_indx].profession)
                            $(".classified_details_born").text(celeb_obj.celeb[jsn_indx].born)
                            $(".classified_details_height").text(celeb_obj.celeb[jsn_indx].height)
                            $(".classified_details_weight").text(celeb_obj.celeb[jsn_indx].weight)
                            $(".classified_details_bio").text(celeb_obj.celeb[jsn_indx].bio)
                        }


                        // let classDictionary = match.class_dictionary;
                        // for (let personName in classDictionary) {
                        //     let index = classDictionary[personName];
                        //     let proabilityScore = match.class_probability[index];
                        //     let elementName = "#score_" + personName;
                        //     $(elementName).html(proabilityScore);
                        // }
                    }






                }).fail(() => {
                    errorMsg_display("Sever Error")
                })



            } catch (e) {
                errorMsg_display("Upload a proper image")
            }
        } else {
            errorMsg_display("Upload a proper image")
        }



    })



    $(".classified_details_modal_closeBtn").click(() => {
        $(".classified_details_modal_wrap").css('transform', "translateY(100%)");
        $(".gallery_img_wrap").removeClass("matched_face")


        $(".dropzone_container").removeClass("dropzone_active")
        $(".dropzone_container_icon").html("<i class='fal fa-arrow-to-top'></i>")
        $(".dropzone_container_text").text("Drop file here or browse")

        $(".dropzone_container").removeClass("dropzoneAniC")

        $(".dropzone_wrapper").trigger("reset");
        $(".dropzone_container_thumbnail").css({
            'background': "url('') no-repeat center",
        })
        server_data = ""

    })




})