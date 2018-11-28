import React from 'react';
//const $ = window.$;
var $ = require('jquery')
class Configuration extends React.Component {
  constructor() {
    super()
    this.first = true
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this._runRequest()
    this.interval = setInterval(() =>
      this._runRequest(), 100000);
  }

  _runRequest(){
      $.ajax({
             url: "http://localhost:3000/get/localhost",
             type: "GET",
             dataType: 'json',
             ContentType: 'application/json',
             success: function(data) {
               console.log(data);
               this.setState({data: data});
             }.bind(this),
             error: function(jqXHR) {
               console.log(jqXHR);
             }.bind(this)
          })
    }
   componentDidUpdate() {
     if (this.first) {
     $('#table tbody').prepend(`<tr id="headers">
          <th class="text-center">Element ID/Name</th>
          <th class="text-center">Tag</th>
          <th class="text-center">Users clicked</th>
          <th class="text-center">Total clicks</th>
          <th class="text-center">Usage</th>
          <th class="text-center">Feedback</th>
          <th class="text-center">Send feedback to</th>
          <th class="text-center">Frequency</th>
          <th class="text-center">Remove</th>
        </tr>`)
        this.first = false
      }
      var $TABLE = $('#table');
      var $BTN = $('#export-btn');
      var $EXPORT = $('#export');

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
              } else {
                myRows[index][normaliseJsonKey($($headers[cellIndex]).html())] = $(this).html();
              }
            });
        });

          // Let's put this in the object like you want and convert to JSON (Note: jQuery will also do this for you on the Ajax request)
          var myObj = {};
          myObj = myRows;
          console.log(JSON.stringify(myObj));
      });

      function normaliseJsonKey(key) {
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

        //$('head').append('<meta http-equiv="refresh" content="300">')
        // <h3 className="card-header text-center font-weight-bold text-uppercase py-4">Elements table</h3>

   }


  render() {
    return (
      <div className="card">
        <p className="card-header text-center" style={{'text-align': 'left','font-family': 'Comic Sans MS, cursive, sans-serif','font-size': '25px','color': 'black'}}> Elements table </p>
        <div className="card-body">
          <div id="table" className="table-editable">
            <table className="table table-bordered table-responsive-md table-striped text-center">
              <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td>{item.info}</td>
                      <td className="pt-3-half" contenteditable="true">{item.info}</td>
                      <td>{item.users}</td>
                      <td>{item.usersClicks}</td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option defaultValue value="high"> High </option>
                          <option value="low"> Low </option>
                        </select>
                      </td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option defaultValue value="yes"> Yes </option>
                          <option value="no"> No </option>
                        </select>
                      </td>

                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option defaultValue value="all"> All </option>
                          <option value="used"> Only used users </option>
                          <option value="unused"> Only unused users </option>
                        </select>
                      </td>
                      <td className="pt-3-half" contenteditable="true">
                        <select>
                          <option defaultValue="month"> Month </option>
                          <option value="quarter"> Quarter </option>
                          <option value="half"> 6 Months </option>
                          <option value="year"> Year </option>
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
