def init_upload():
    import sys
    import os
    sys.path.append("..")
    import bottle
    from bottle import route, request, redirect, static_file

    @route('/saves/<filename>')
    def serve_static(filename):
        return static_file(filename, root='./saves')

    @route('/upload', method='POST')
    def do_upload():
        upload = request.files.get('upload')
        name, ext = os.path.splitext(upload.filename)
        if ext not in ('.png', '.jpg', '.jpeg'):
            print("File extension not allowed.")

        save_path = "./saves/"
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        else :
            print("Directory already exists.")
        save = save_path + upload.filename     

        if os.path.exists(path=save):
            print("File already exists.")
        else:
            upload.save(save)

        print('OK')