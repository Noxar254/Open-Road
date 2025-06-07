@echo off
echo Exporting Open Road Market enquiries to Excel...
node firestore-to-excel.js
echo.
echo If successful, your files will be in the 'exports' folder.
echo.
pause
