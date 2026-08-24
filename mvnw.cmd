@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@echo off
setlocal enabledelayedexpansion

set MAVEN_CMD_LINE_ARGS=%*

if NOT "%JAVA_HOME%" == "" goto haveJavaHome
for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
if NOT "%JAVACMD%" == "" goto execute
echo Error: JAVA_HOME is not set and no 'java' command could be found in your PATH. >&2
goto error

:haveJavaHome
set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:execute
set "WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar"

if exist "%WRAPPER_JAR%" goto run
echo Downloading Maven Wrapper...
"%JAVACMD%" -Dmaven.wrapper.version=3.2.0 -jar "%~dp0.mvn\wrapper\maven-wrapper-downloader.jar"

:run
"%JAVACMD%" %MAVEN_OPTS% -jar "%WRAPPER_JAR%" %MAVEN_CMD_LINE_ARGS%
goto end

:error
exit /b 1

:end
exit /b 0
