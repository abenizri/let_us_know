import React from 'react';
var $ = require('jquery')

class Configuration extends React.Component {
  constructor(props) {
    super(props)
    this.first = true
    this.state = {
      data: [],
      rawData: [],
    }
  }

  componentDidMount() {
    this._runRequest()
    // this.interval = setInterval(() =>
    //   this._runRequest(), 100000);
  }

  _runRequest(){
     var domain = $('location').attr('host') || 'localhost'
      $.ajax({
             url: `http://localhost:3000/get/${domain}`,
             type: "GET",
             dataType: 'json',
             ContentType: 'application/json',
             success: function(data) {
               // console.log(data);
               this.setState({data: data, rawData: data});
             }.bind(this),
             error: function(jqXHR) {
               console.log(jqXHR);
             }.bind(this)
          })
    }

  componentDidUpdate(prevProps, prevState) {
     if (this.first) {
     $('#table tbody').prepend(`<tr id="headers">
          <th style="display: none" class="text-center">#</th>
          <th class="text-center">Element ID/Name</th>
          <th class="text-center">Tag Feature Name</th>
          <th class="text-center">Users clicked</th>
          <th class="text-center">Total clicks</th>
          <th class="text-center">Usage</th>
          <th class="text-center">Want feedback</th>
          <th class="text-center">Send feedback to</th>
          <th class="text-center">Duration</th>
          <th class="text-center">Remove</th>
        </tr>`)
        this.first = false
      }
      var $TABLE = $('#table');
      var $BTN = $('#export-btn');
      var $EXPORT = $('#export');
      var self = this

      $('#refresh').click(function(e){
        self._runRequest()
      })

      $('#save').click(function(e) {
          var myRows = [];
          var $headers = $("th");
          var $rows = $('table tr:not([id="headers"])').each(function(index) {
            var $cells = $(this).find("td");
            myRows[index] = {};
            $cells.each(function(cellIndex) {
              var firstChild = $(this).children().first().prop("tagName")
              if (firstChild && firstChild.length && firstChild === 'SELECT') {
                myRows[index][normaliseJsonKey($($headers[cellIndex]).html())] = $(this).children().children("option:selected"). val()
              } else if (firstChild && firstChild.length && firstChild === 'SPAN')  {

              } else {
                myRows[index][normaliseJsonKey($($headers[cellIndex]).html())] = $(this).html().replace(/&gt;/g,'>');
              }
            });
        });

          // Let's put this in the object like you want and convert to JSON (Note: jQuery will also do this for you on the Ajax request)
          var myObj = {};
          myObj = myRows;

          var oldState = []
          self.state.data.map(function(item, key) {
            var obj = {
              selector: item.selector,
              tagName: item.info,
              usage: item.usage,
              feedback: item.feedback,
              sendFeedbackTo: item.sendFeedbackTo,
              duration: item.duration
            }
            oldState.push(obj)
          })

          var newState = []
          for (var e of myObj)  {
            var obj = {
              selector: e.selector,
              tagName: e.TagFeatureName,
              usage: e.Usage,
              feedback: e.WantFeedback,
              sendFeedbackTo: e.SendFeedbackTo,
              duration: e.Duration
            }
            newState.push(obj)
          }

          var data = []
          var domain = $('location').attr('host') || 'localhost'
          for (var e of oldState){
              var element = newState.find( x => x.selector === e.selector )
              if(element) {
                if (JSON.stringify(element) === JSON.stringify(e)) {
                } else {
                  element.domain = domain
                  element.status = 'active'
                  data.push(element)
                }
              } else {
                  e.domain = domain
                  e.status = 'removed'
                  data.push(e)
              }
          }
          $.ajax({
                 url: "http://localhost:3000/save",
                 type: "POST",
                 dataType: 'json',
                 data: { data },
                 ContentType: 'application/json',
                 success: function(data) {
                   console.log('we made it');
                   // console.log(data);
                   // this.setState({data: data, rawData: data});
                 }.bind(this),
                 error: function(jqXHR) {
                   console.log(jqXHR);
                 }.bind(this)
              })
      });

      function normaliseJsonKey(key) {
        if (key === '#') return 'selector'
        key = key.replace(/(?:_| |\b)(\w)/g, function(str, p1) { return p1.toUpperCase()})
        return key.split('/')[0]
      }

      $('.table-add').click(function () {
      var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
      $TABLE.find('table').append($clone);
      });

      $('.table-remove').click(function () {
      $(this).parents('tr').detach();
      });

      $('.table-up').click(function () {
      var $row = $(this).parents('tr');
      if ($row.index() === 1) return; // Don't go above the header
      $row.prev().before($row.get(0));
      });

      $('.table-down').click(function () {
      var $row = $(this).parents('tr');
      $row.next().after($row.get(0));
      });

      // A few jQuery helpers for exporting only
      $.fn.pop = [].pop;
      $.fn.shift = [].shift;

      $BTN.click(function () {
      var $rows = $TABLE.find('tr:not(:hidden)');
      var headers = [];
      var data = [];

      // Get the headers (add special header logic here)
      $($rows.shift()).find('th:not(:empty)').each(function () {
      headers.push($(this).text().toLowerCase());
      });

      // Turn all existing rows into a loopable array
      $rows.each(function () {
      var $td = $(this).find('td');
      var h = {};

      // Use the headers from earlier to name our hash keys
      headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
      });

      data.push(h);
      });
      // Output the result
      $EXPORT.text(JSON.stringify(data));
      });
   }


  render() {
    return (
      <div className="card" style={{ 'margin-top': '50px'}}>
         <p className="card-header text-left" style={{'text-align': 'left','font-family': 'Comic Sans MS, cursive, sans-serif','font-size': '25px','color': 'black'}}> Elements table </p>
        <img id="refresh" src={require('./../../images/refresh_grey_192x192.png')} width="30px" height="30px" style={{'margin-left': '95%','margin-top': '-40px'}} title="refresh" />
        <div className="card-body">
          <div id="table" className="table-editable">
            <table className="table table-bordered table-responsive-md table-striped text-center">
              <tbody>{this.state.data.filter(x => x.status === 'active').map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td style={{"display": "none"}}>{item.selector}</td>
                      <td>{item.info}</td>
                      <td className="pt-3-half" contenteditable="true">{item.info}</td>
                      <td>{item.users}</td>
                      <td>{item.usersClicks}</td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option selected={item.usage === 'high' ? true : false } value="high"> High </option>
                          <option selected={item.usage === 'low' ? true : false } value="low"> Low </option>
                        </select>
                      </td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option selected={item.feedback === 'yes' ? true : false } value="yes"> Yes </option>
                          <option selected={item.feedback === 'no' ? true : false } value="no"> No </option>
                        </select>
                      </td>

                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option selected={item.sendFeedbackTo === 'all' ? true : false }  value="all"> All </option>
                          <option selected={item.sendFeedbackTo === 'used' ? true : false }  value="used"> Only used users </option>
                          <option selected={item.sendFeedbackTo === 'unused' ? true : false }  value="unused"> Only unused users </option>
                        </select>
                      </td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option selected={item.duration === 'month' ? true : false } value="month"> Month </option>
                          <option selected={item.duration === 'quarter' ? true : false } value="quarter"> Quarter </option>
                          <option selected={item.duration === 'half' ? true : false } value="half"> 6 Months </option>
                          <option selected={item.duration === 'year' ? true : false }  value="year"> Year </option>
                        </select>
                      </td>
                      <td>
                        <span className="table-remove"><button type="button" className="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                  </tr>
                )
             })}
             </tbody>
            </table>
             <div>
               <button style={{float: 'right'}} id="save"> Save </button>
             </div>
           </div>
         </div>
       </div>
    )
  }
 }
export default Configuration;
