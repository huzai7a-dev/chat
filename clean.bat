del /q "%cd%\uploads\*"
FOR /D %%p IN ("%cd%\uploads\*.*") DO rmdir "%%p" /s /q