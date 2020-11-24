'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,io } = app;
  // app.router.resources('topics', '/api/v2/topics', 'topics');
  // router.resources('topics', '/api/v2/topics', controller.topics);


    router.get('/api/tapd/initData', controller.tapd.init);
    router.get('/api/lq/total',controller.data.init);
    router.post('/api/wechat', controller.wechat.postMessage);
    router.get('/api/wechat', controller.wechat.index);
    router.post('/api/wechat/login', controller.user.wechat);
    router.get('/api/user', controller.user.getUserInfo); 
    router.get('/api/currentUser', controller.user.getUserInfo); 
    router.post('/api/tapd', controller.tapd.index);
    router.get('/api/currentUser', controller.user.getUserInfo);
    router.get('/api/project/notice', controller.user.notice);
    router.get('/api/activities', controller.workplace.getActivities);
    router.get('/api/fake_chart_data', controller.workplace.getChartData);
    router.get('/api/project/all', controller.workplace.getAll);

    
      // app.io.of('/')
    //io.route('chat', app.io.controller.chat.index);

  // app.io.of('/chat')
  io.of('/poker').route('poker', io.controller.poker.index);
  io.of('/tapd').route('tapd', io.controller.tapd.index);
  io.of('/datav').route('init', io.controller.datav.index);
  io.of('/datalq').route('init',io.controller.datalq.index);
  io.of('/datalq').route('data1',io.controller.datalq.data1);
  io.of('/datalq').route('data2',io.controller.datalq.data2);
  io.of('/datalq').route('data3',io.controller.datalq.data3);
  io.of('/datalq').route('data4',io.controller.datalq.data4);
  io.of('/datalq').route('data5',io.controller.datalq.data5);
  io.of('/datalq').route('data6',io.controller.datalq.data6);
  io.of('/datalq').route('data7',io.controller.datalq.data7);

  

  // router.get('/api/test/download', controller.exam.download);

  // router.resources('user', '/api/user', controller.user);
};
