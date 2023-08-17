// ==UserScript==
// @name         Table to CSV Downloader
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Download table content as CSV
// @author       Mr. Nunez
// @match        *://*/*  // This will match all URLs
// @grant        none
// ==/UserScript==
console.log("Tampemonkey for CSV Download tables Activated");
setTimeout(function(){
    'use strict';
    console.log("5 Seconds Rule Triggered");

    function downloadCSV(csv, filename) {
        var csvFile = new Blob([csv], { type: "text/csv" });
        var downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function exportTableToCSV(table, filename) {
        var csv = [];
        var rows = table.getElementsByTagName("tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            for (var j = 0; j < cols.length; j++){
                row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"'); // Wrap in quotes and escape existing quotes
            }
            csv.push(row.join(","));
        }
        downloadCSV(csv.join("\n"), filename);
    }

    var tables = document.querySelectorAll('table');

    tables.forEach(function(table, index) {
        console.log("Adding button on table", table, index);
        var button = document.createElement('button');
        button.textContent = 'Download CSV';
        button.className = 'btn btn-default';
        button.addEventListener('click', function () {
            exportTableToCSV(table, 'table' + index + '.csv');
        });
        table.insertAdjacentElement('beforebegin', button);
    });
},5000);
