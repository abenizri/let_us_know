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
      page: item.page,
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
      var element = newState.find( x => x.selector === item.selector && x.page === item.page)
      var elementClone = Object.assign({}, element)
      var elementItem = Object.assign({}, item)

      delete elementClone.durationStart
      delete elementClone.durationEnd

      delete elementItem.durationStart
      delete elementClone.durationEnd
      if(element) {
        if (JSON.stringify(elementClone) === JSON.stringify(elementItem)) {
        } else {
          if ( element.durationStart !== element.durationEnd ) {
            if (element.enableCampaign === 'yes') {
              item.durationStart = element.durationStart
              item.durationEnd =  element.durationEnd
              element.status = 'active'
            } else {
              element.status = 'pending'
            }
            data.push(element)
          }
        }
      } else {
          item.status = 'removed'
          data.push(item)
      }
  }
  return data
}

function _normaliseJsonKey(key) {
  if (key === 'Total Clicks') return 'total'
  if (key === '#') return 'selector'
  key = key.trim().replace(/(?:_| |\b)(\w)/g, function(str, p1) { return p1.toUpperCase()})
  key = key.charAt(0).toLowerCase() + key.slice(1)
  return key.split('/')[0].trim()
}
