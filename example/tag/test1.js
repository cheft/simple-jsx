module.exports = function(data) {
  return el('test1', {}, [
    el('h1', {"id":"h1","class":"h1"}, ['Hello World']),
    el('table', {"style":"text-align: center;"}, [
      el('tbody', {}, data.list.map(function(item) {
          return el('tr', {}, [
            el('td', {}, ['111']),
            el('td', {}, ['222'])
          ]);
        })
      )
    ])
  ]);
};
