1.初始化Express项目
npm install -g express-generator
express -e blog

2.使用express-session和connect-mongo将信息存到MongoDB
npm install express-session --save
npm install connect-mongo --save

3.supervisor会自动重启应用
npm install -g supervisor

4.页面通知功能
npm install connect-flash --save

5.inspector调试
node-debug app.js //有ref报错
可以使用node --inspect --debug-brk app.js来调试
