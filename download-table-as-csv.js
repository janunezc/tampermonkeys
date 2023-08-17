// ==UserScript==
// @name         Table to CSV Downloader
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Download table content as CSV
// @author       Mr. Nunez
// @match        *://*/*  // This will match all URLs
// @grant        GM_addStyle
// ==/UserScript==

setTimeout(function() {
    'use strict';

    GM_addStyle(`
        .custom-context-menu {
            display: none;
            position: absolute;
            z-index: 1000;
            background-color: white;
            border: 1px solid #ccc;
        }
        .custom-context-menu-item {
            padding: 5px 10px;
            cursor: pointer;
        }
        .custom-context-menu-item:hover {
            background-color: #f0f0f0;
        }
    `); // CSS for the context menu

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
            for (var j = 0; j < cols.length; j++)
                row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"'); // Wrap in quotes and escape existing quotes

            csv.push(row.join(","));
        }
        downloadCSV(csv.join("\n"), filename);
    }

    var contextMenu = document.createElement('div');
    contextMenu.className = 'custom-context-menu';
    var menuItem = document.createElement('div');
    menuItem.className = 'custom-context-menu-item';
    menuItem.textContent = 'Download CSV';
    contextMenu.appendChild(menuItem);
    document.body.appendChild(contextMenu);

    var tables = document.querySelectorAll('table');

    tables.forEach(function(table, index) {
        table.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Prevent the default context menu
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.style.display = 'block';
            menuItem.onclick = function() {
                exportTableToCSV(table, 'table' + index + '.csv');
                contextMenu.style.display = 'none'; // Hide the menu after clicking
            };
        });
    });

    // Hide the custom context menu when clicking elsewhere
    window.addEventListener('click', function () {
        contextMenu.style.display = 'none';
    });
},5000);
