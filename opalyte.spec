# opalyte.spec

# Import required modules
import sys
from os.path import abspath, join
from PyInstaller.utils.hooks import collect_data_files

# Set the path to the main script
entry_point = 'main.py'

# Set the base path of the project
base_path = abspath(".")

# Set additional data files or directories to be included
extra_datas = collect_data_files('views') + collect_data_files('web')

# Define the PyInstaller spec options
a = Analysis(
    [entry_point],
    pathex=[base_path],
    binaries=[],
    datas=extra_datas,
    hiddenimports=['eel', 'json', 'datetime', 'os', 'sys', 'apscheduler', 'peewee', 'plyer', 'jinja2'],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
    noarchive=False,
)

# Set the spec file options
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    [],
    exclude_binaries=True,
    name='opalyte',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # Set to False if you want a windowed application
    onefile=True,
    icon='web/icon.ico',
)

# Collate the spec file
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    name='opalyte',
)
