import shutil
import os


os.makedirs('web_dynamic/templates', exist_ok=True)


shutil.copytree('web_flask/static', 'web_dynamic/static')
if os.path.exists('web_flask/templates/100-hbnb.html'):
    use = '100-hbnb.html'
else:
    use = '8-hbnb.html'
shutil.copy(f'web_flask/templates/{use}',
            'web_dynamic/templates/0-hbnb.html')
shutil.copy('web_flask/__init__.py', 'web_dynamic/__init__.py')
shutil.copy('web_flask/100-hbnb.py', 'web_dynamic/0-hbnb.py')
