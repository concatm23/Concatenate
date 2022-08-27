
# Concatenate    
## Client Side  

**Require environment:**  
- `Windows 7 or Windows 10 or Windows 11 (32bit or 64bit all accepts)`   
- `Node.js v16.15.0 +`  
- `Electron v18.1.0 +`  

**Notice: Not support Linux or Mac OS version now**
**This is not in the plan of this software.**  
- - -   
**Require npm package:**  
- `internet-available@1.0.0`   
- `js-yaml@4.1.0`  
- `better-sqlite3@7.5.3`  
- `ws@8.7.0`  
- `chalk@4.0.0`
- `@electron/remote@2.0.8`

- - -
**How to install environment and packages:**  
First, run `npm i electron@18.1.0 --save-dev` to install Electron  
Next, run  
- `npm i internet-available@1.0.0 --save` - Checking internet available  
- `npm i js-yaml@4.1.0 --save` - Parse yaml to json
- `npm i better-sqlite3@7.5.3 --save` - Sqlite3 Database 
- `npm i ws@8.7.0 --save` - WebSocket
- `npm i chalk@4.0.0 --save` - Colorful letters in CLI  
- `npm i @electron/remote@2.0.8 --save` - Electron RPC

to install packages  
You can use `electron .` to run and debug your application.    
Notice: Application default find resources in 'resources/app.asar/', you should use `--fs` options to set default directory is './'    
Use `--debug` to enable debug mode  
- - -
#### Fonts License
Fonts `Noto Sans regular 400px` Google, Inc. All Rights Reserved.
- - -
### LICENSE: GPL V3