@echo off 
setlocal enableDelayedExpansion

:: choose whether to start frontend, or backend or both
echo "To start frontend ^& backend -> press 1"
echo "To start only frontend -> press 2"
echo "To start only backend -> press 3"
set /p option= Select option:  

:: echo you selected %option%
if %option%==1 (goto :first) else if %option%==2 (goto :second) else if %option%==3 (goto :third) else (echo Not a valid selection.)

:first
start cmd /k "cd .\frontend\common\ && npx expo start --dev-client"
cmd /k "cd .\backend\ && mvn spring-boot:run"
exit /b 0

:second
cmd /k "cd .\frontend\common\ && npx expo start"
exit /b 0

:third
cmd /k "cd .\backend\ && mvn spring-boot:run"
exit /b 0
	
pause