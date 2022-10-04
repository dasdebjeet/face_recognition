$(document).ready(() => {


    $(".dropzone_container_overlay").click(() => {
        $(".img_inp").trigger("click")
    })

    var server_data
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
                console.log(files)
                // $(".editor_body").css("min-height", '355px')

                inputElement = files
                // updateThumnail(dropZoneElement, files[0], formData)
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



    $(".classify_btn").click(() => {
        $(".dropzone_container").toggleClass("dropzoneAniC")




        // $.post("http://127.0.0.1:5000/classify_image", {
        //     image_data: data_url
        // }, function (data, status) {
        //     console.log(data, status)
        // })

        // var url = "http://127.0.0.1:5000/classify_image";

        // $.post(url, {
        //     image_data: "dsd"
        // }, function (data, status) {
        //     alert(data)
        // })


        $(".classified_details_modal_wrap").css('transform', "translateY(0%)");


    })



    $(".classified_details_modal_closeBtn").click(() => {
        $(".classified_details_modal_wrap").css('transform', "translateY(100%)");
    })



    // const art_json = JSON.stringify(article_data);
    // let article_obj = JSON.parse(art_json);
})