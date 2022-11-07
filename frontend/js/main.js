"use strict";

// api urls
const baseUrl = 'http://localhost:3001';
const tracksApiUrl = '/api/tracks';
const playlistsApiUrl = '/api/playlists';

// http options
const httpHeaders = {
        'Content-Type': 'application/json'
};

// dom elements
const inputSearchTracks = document.getElementById('inputSearchTracks');
const btnSearchTracks = document.getElementById('btnSearchTracks');
const tBodySearchTracks = document.getElementById('tBodySearchTracks');
const defaultTextSearchTracks = document.getElementById('defaultTextSearchTracks');
const btnResetSearchTracks = document.getElementById('btnResetSearchTracks');
const noRecordFoundTracks = document.getElementById('noRecordFoundTracks');
const noDataAvailablePlaylist = document.getElementById('noDataAvailablePlaylist');
const tBodyPlaylists = document.getElementById('tBodyPlaylists');

// messages
const messages = {
    NO_VALUE_ENTERED: 'No value entered'
};

const maxNoOfRecords = 10;

// functions
async function searchTracks() {
    const searchText = inputSearchTracks.value.trim();
    if (!searchText) {
        alert(messages.NO_VALUE_ENTERED);
        return;
    }
    const queryParams = new URLSearchParams({
        searchText: searchText,
        maxNoOfRecords: maxNoOfRecords,
    });

    try{
        const response = await httpGet(baseUrl + tracksApiUrl + '?' + queryParams);
        console.log("response ::: " + JSON.stringify(response));
    }catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }

    // fetch(baseUrl + tracksApiUrl + '?' + queryParams)
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((response) => {
    //         const tracks = response.data;
    //         tBodySearchTracks.innerHTML = '';
    //         defaultTextSearchTracks.hidden = true;
    //         if (!tracks || !tracks.length) {
    //             noRecordFoundTracks.hidden = false;
    //             return;
    //         }
    //         noRecordFoundTracks.hidden = true;
    //         for (const index in tracks) {
    //             const tdSerialNo = document.createElement('td');
    //             const serialNo = String(Number(index) + 1);
    //             const textNodeSerialNo = document.createTextNode(serialNo);
    //             tdSerialNo.appendChild(textNodeSerialNo);
    //
    //             const tdName = document.createElement('td');
    //             const textNodeName = document.createTextNode(nullDisplayHandler(tracks[index].title));
    //             tdName.appendChild(textNodeName);
    //
    //             const tdArtist = document.createElement('td');
    //             const textNodeArtist = document.createTextNode(nullDisplayHandler(tracks[index].artistName));
    //             tdArtist.appendChild(textNodeArtist);
    //
    //             const tdDuration = document.createElement('td');
    //             const textNodeDuration = document.createTextNode(nullDisplayHandler(tracks[index].duration));
    //             tdDuration.appendChild(textNodeDuration);
    //
    //             const tdAlbum = document.createElement('td');
    //             const textNodeAlbum = document.createTextNode(nullDisplayHandler(tracks[index].albumTitle));
    //             tdAlbum.appendChild(textNodeAlbum);
    //
    //             const tdDateCreated = document.createElement('td');
    //             const textNodeDateCreated = document.createTextNode(nullDisplayHandler(tracks[index].dateCreated).split('T')[0]);
    //             tdDateCreated.appendChild(textNodeDateCreated);
    //
    //             const tr = document.createElement('tr');
    //             tr.append(tdSerialNo, tdName, tdArtist, tdDuration, tdAlbum, tdDateCreated);
    //
    //             tBodySearchTracks.append(tr);
    //         }
    //
    //     })
    //     .catch((error) => {
    //         alert('Error ! : ' + error);
    //         console.log("error ::: " + error);
    //     });
}

function fetchAllPlaylists() {
    fetch(baseUrl + playlistsApiUrl)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            const playlists = response.data;
            tBodyPlaylists.innerHTML = '';
            if (!playlists || !playlists.length) return;
            noDataAvailablePlaylist.hidden = true;
            for (const index in playlists) {
                const tdSerialNo = document.createElement('td');
                const serialNo = String(Number(index) + 1);
                const textNodeSerialNo = document.createTextNode(serialNo);
                tdSerialNo.appendChild(textNodeSerialNo);

                const tdName = document.createElement('td');
                const textNodeName = document.createTextNode(nullDisplayHandler(playlists[index].name));
                tdName.appendChild(textNodeName);

                const tdNoOfTracks = document.createElement('td');
                const textNodeNoOfTracks = document.createTextNode(nullDisplayHandler(playlists[index].numberOfTracks));
                tdNoOfTracks.appendChild(textNodeNoOfTracks);

                const tdTotalPlaytime = document.createElement('td');
                const textNodeTotalPlaytime = document.createTextNode(nullDisplayHandler(playlists[index].totalPlayTime));
                tdTotalPlaytime.appendChild(textNodeTotalPlaytime);

                const tdAction = document.createElement('td');
                const textNodeAction = document.createTextNode('---');
                tdAction.appendChild(textNodeAction);

                const tr = document.createElement('tr');
                tr.append(tdSerialNo, tdName, tdNoOfTracks, tdTotalPlaytime, tdAction);

                tBodyPlaylists.append(tr);
            }

        })
        .catch((error) => {
            alert('Error ! : ' + error);
            console.log("error ::: " + error);
        });
}

async function httpGet(url) {
    const response = await fetch(url);
    return response.json();
}

async function httpPost(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: httpHeaders,
        body: JSON.stringify(data)
    });
    return response.json();
}

async function httpPut(url, data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: httpHeaders,
        body: JSON.stringify(data)
    });
    return response.json();
}

async function httpDelete(url) {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    return response.json();
}

function resetSearchTracks() {
    inputSearchTracks.value = '';
    tBodySearchTracks.innerHTML = '';
    defaultTextSearchTracks.hidden = false;
    noRecordFoundTracks.hidden = true;
}

function nullDisplayHandler(value) {
    if (value === null) return '---';
    return value;
}

function showModalWindow(buttonEl) {
    const modalTarget = "#" + buttonEl.getAttribute("data-target");

    document.querySelector(".modal-fader").className += " active";
    document.querySelector(modalTarget).className += " active";
}

function hideAllModalWindows() {
    const modalFader = document.querySelector(".modal-fader");
    const modalWindows = document.querySelectorAll(".modal-window");

    if (modalFader.className.indexOf("active") !== -1) {
        modalFader.className = modalFader.className.replace("active", "");
    }

    modalWindows.forEach(function (modalWindow) {
        if (modalWindow.className.indexOf("active") !== -1) {
            modalWindow.className = modalWindow.className.replace("active", "");
        }
    });
}

function init() {
    btnSearchTracks.addEventListener('click', searchTracks);
    btnResetSearchTracks.addEventListener('click', resetSearchTracks);
    fetchAllPlaylists();
    (function () {
        document.querySelectorAll(".open-modal").forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                hideAllModalWindows();
                showModalWindow(this);
            });
        });

        document.querySelectorAll(".modal-hide").forEach(function (closeBtn) {
            closeBtn.addEventListener("click", function () {
                hideAllModalWindows();
            });
        });

        document.querySelector(".modal-fader").addEventListener("click", function () {
            hideAllModalWindows();
        });
    })();
}

// function calls
init();