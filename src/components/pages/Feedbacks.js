import React from 'react';
import DatePicker from "./DataPicker.js";
import "react-datepicker/dist/react-datepicker.css";
import Utils from './utils/config.js'
var $ = require('jquery')

class Feedbacks extends React.Component {
  constructor(props) {
    super(props)
    this.first = true
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this._runRequest()

    let self = this
    $('#refresh').click(function(e){
      self._runRequest()
    })
  }

  _runRequest(){
     const domain = $('location').attr('host') || 'localhost'
     let self = this
      $.ajax({
         url: `http://localhost:3000/getFeedbacksPerDomain/${domain}`,
         type: "GET",
         dataType: 'json',
         ContentType: 'application/json',
         success: function(data) {
           this.setState({ data: data });
           console.log('finished getting results');
         }.bind(this),
         error: function(jqXHR) {
            self.setState({ data: [] });
           console.log(jqXHR);
         }
      })
    }

  componentDidUpdate(prevProps, prevState) {
     if (this.first) {
     $('#table tbody').prepend(`<tr id="headers">
          <th style="display: none" class="text-center">#</th>
          <th class="text-center">Page</th>
          <th class="text-center">Image</th>
          <th class="text-center">Element Id</th>
          <th class="text-center">Feature Name</th>
          <th class="text-center">FeedbackRate</th>
          <th class="text-center">Feedback Text</th>
          <th class="text-center">Status</th>
          <th class="text-center">Remove</th>
        </tr>`)
        this.first = false
      }
      var $TABLE = $('#table');
      var $BTN = $('#export-btn');
      var $EXPORT = $('#export');
      var self = this

      $('.table-remove').click(function () {
        $(this).parents('tr').detach();
      });

      $('.table-up').click(function () {
        let $row = $(this).parents('tr');
        if ($row.index() === 1) return; // Don't go above the header
        $row.prev().before($row.get(0));
      });

      $('.table-down').click(function () {
        let $row = $(this).parents('tr');
        $row.next().after($row.get(0));
      });

      // A few jQuery helpers for exporting only
      $.fn.pop = [].pop;
      $.fn.shift = [].shift;

      $BTN.click(function () {
      let $rows = $TABLE.find('tr:not(:hidden)');
      let headers = [];
      let data = [];

      // Get the headers (add special header logic here)
      $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
      });

      // Turn all existing rows into a loopable array
      $rows.each(function () {
      let $td = $(this).find('td');
      let h = {};

      // Use the headers from earlier to name our hash keys
      headers.forEach(function (header, i) {
        h[header] = $td.eq(i).text();
      });

      data.push(h);
      });
      // Output the result
      $EXPORT.text(JSON.stringify(data));
      });

      $('.dp').click(function(e){
        $(this).siblings().css('display', 'block')
      })
   }


  render() {
    return (
      <div className="card" style={{ 'borderStyle': 'none'}}>
        <div className="card-body">

        <div classsname="card-header text-left" style={{height: '50px'}}>
          <button id="refresh" width="30px" height="30px" style={{outline: 'none', 'float': 'right', 'backgroundColor': 'transparent'}} title="refresh"><img width="30px" height="30px"  alt="" src={require('./../../images/refresh_grey_192x192.png')} /></button>
        </div>

          <div id="table" className="table-editable" style={{'fontSize': '13px'}}>
            <table className="table table-bordered table-responsive-md table-striped text-center">
              <tbody>{this.state.data.filter(x => x.status !== 'removed').map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td style={{"display": "none"}}>{item.selector}</td>
                      <td>{item.page}</td>
                      <td><img className="imageContainer" src={item.dataUri}/></td>
                      <td>{item.elementId}</td>
                      <td className="pt-3-half" contenteditable="true">{item.featureName}</td>
                      <td>{item.feedbackRate}</td>
                      <td>{item.feedbackText}</td>
                      <td>{item.status}</td>
                      <td>
                        <span className="table-remove"><button type="button" className="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span>
                      </td>
                  </tr>
                )
             })}
             </tbody>
            </table>
           </div>

         </div>
       </div>

    )
  }
 }
export default Feedbacks;
//
