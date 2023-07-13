# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('/home/grayson/code/opalyte/venv/lib/python3.11/site-packages/eel/eel.js', 'eel'), ('web', 'web'), ('views', 'views'), ('api', 'api')],
    hiddenimports=['bottle_websocket', 'json', 'datetime', 'os', 'sys', 'apscheduler', 'peewee', 'plyer', 'jinja2', 'api'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='opalyte',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    onefile=True,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='web/icon.ico',
)
coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='opalyte',
)
