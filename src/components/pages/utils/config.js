var $ = require('jquery')

exports.tableToJson = function(tableSelector) {
  let myRows = []
  let $headers = $("#table th")

  $(tableSelector).each(function(index) {
    myRows[index] = {}
    var $cells = $(this).find("td");
    $cells.each(function(cellIndex) {
      let firstChild = $(this).children().first().prop("tagName")
      if (firstChild && firstChild.length && firstChild === 'SELECT') {
        myRows[index][_normaliseJsonKey($($headers[cellIndex]).html())] = $(this).children().children("option:selected").val()
      } else if (firstChild && firstChild.length && firstChild === 'DIV')  {
        let text = ''
        $(this).find('input').each(function(x) {
          text+= ' ' + $(this).val()
        })
        myRows[index]['durationStart'] = text.trim().split(' ')[0]
        myRows[index]['durationEnd'] = text.trim().split(' ')[1]
      } else {
        myRows[index][_normaliseJsonKey($($headers[cellIndex]).html())] = $(this).html().replace(/&gt;/g,'>');
      }
    });
  });
  return myRows
}

 exports.jsonToDataObject = function(jsonArray, domain){
  let newArray = []
  jsonArray.map(function(item, key) {
    let obj = {
      selector: item.selector,
      domain,
      category: item.category,
      featureName: item.featureName,
      elementId: item.elementId,
      usage: item.usage,
      enableCampaign: item.enableCampaign,
      recipients: item.recipients,
      feedbackForm: item.feedbackForm,
      durationStart: item.durationStart,
      durationEnd: item.durationEnd,
      status: item.status
    }
    newArray.push(obj)
  })
  return newArray
}

exports.itemToModify = function(newState, oldState){
  var data = []
  for (let item of oldState) {
      var element = newState.find( x => x.selector === item.selector && x.category === item.category)
      if(element) {
        if (item.durationStart === null)  item.durationStart =  element.durationStart
        if (item.durationEnd === null)  item.durationEnd =  element.durationEnd
        if (JSON.stringify(element) === JSON.stringify(item)) {
        } else {
          element.status = 'active'
          data.push(element)
        }
      } else {
          item.status = 'removed'
          data.push(item)
      }
  }
  return data
}

function _normaliseJsonKey(key) {
  if (key === '#') return 'selector'
  key = key.trim().replace(/(?:_| |\b)(\w)/g, function(str, p1) { return p1.toUpperCase()})
  key = key.charAt(0).toLowerCase() + key.slice(1)
  return key.split('/')[0].trim()
}
