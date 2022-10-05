from flask import Flask, request, jsonify, render_template
import time

import util

# from flask_cors import CORS

app = Flask(
    __name__,
    template_folder='templates',  # Name of html file folder
    static_folder='static'  # Name of directory for static files
)


@app.route('/')  # What happens when the user visits the site
def base_page():
    return render_template(
        'app.html',  # Template file path, starting from the templates' folder.
    )


@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    image_data = request.form['image_data']
    # image_data = image_data.replace(" ", "")
    # print(image_data)
    response = jsonify(util.classify_image(image_data))
    response.headers.add('Access-Control-Allow-Origin', '*')

    time.sleep(4)
    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Classification")
    util.load_saved_artifacts()
    app.run(port=5000)
