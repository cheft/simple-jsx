module.exports = function(data) {
  return el('test1', {}, [
    // TODO 事件在IE6、7下不响应
    el('h1', {"id":"h1","class":"h1","onclick":"test();"}, ['Hello World']),
    el('table', {"style":"text-align: center;"}, [
      el('tbody', {}, data.list.map(function(item) {
        return el('tr', {}, [
          el('td', {}, ['name: name--' + item]),
          el('td', {}, ['age: age----' + item]),
          el('td', {}, ['pwd: pwd----' + item]),
          el('td', {}, ['email: email----' + item]),
          el('td', {}, ['phone: phone----' + item]),
          el('td', {}, ['website: website----' + item]),
          el('td', {}, ['blog: blog----' + item]),
          el('td', {}, ['weibo: weibo----' + item]),
          el('td', {}, ['QQ: QQ----' + item]),
          el('td', {}, ['wechat: wechat----' + item]),
          el('td', {}, ['adrs: adrs----' + item]),
          el('td', {}, ['works: works----' + item])
        ]);
      }))
    ])
  ]);
};
