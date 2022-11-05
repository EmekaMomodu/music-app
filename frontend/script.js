"use strict";

const baseUrl = 'http://localhost:3001';
const tracksApiUrl = '/api/tracks';
const playlistsApiUrl = '/api/playlists';

const maxNoOfRecords = 10;

const httpOptions = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const inputSearchTracks = document.getElementById('inputSearchTracks');
const btnSearchTracks = document.getElementById('btnSearchTracks');
const tBodySearchTracks = document.getElementById('tBodySearchTracks');
const defaultTextSearchTracks = document.getElementById('defaultTextSearchTracks');
const btnResetSearchTracks = document.getElementById('btnResetSearchTracks');
const noRecordFoundTracks = document.getElementById('noRecordFoundTracks');
const noDataAvailablePlaylist = document.getElementById('noDataAvailablePlaylist');
const tBodyPlaylists = document.getElementById('tBodyPlaylists');

const messages = {
    NO_VALUE_ENTERED: 'No value entered'
};

const searchTracks = () => {
    const searchText = inputSearchTracks.value.trim();
    if(!searchText){
        alert(messages.NO_VALUE_ENTERED);
        return;
    }
    const queryParams =  new URLSearchParams({
        searchText: searchText,
        maxNoOfRecords: maxNoOfRecords,
    });
    fetch(baseUrl + tracksApiUrl + '?' + queryParams)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            const tracks = response.data;
            tBodySearchTracks.innerHTML = '';
            defaultTextSearchTracks.hidden = true;
            if(!tracks || !tracks.length){
                noRecordFoundTracks.hidden = false;
                return;
            }
            noRecordFoundTracks.hidden = true;
            for(const index in tracks){
                const tdSerialNo = document.createElement('td');
                const serialNo = String(Number(index) + 1);
                const textNodeSerialNo = document.createTextNode(serialNo);
                tdSerialNo.appendChild(textNodeSerialNo);

                const tdName = document.createElement('td');
                const textNodeName = document.createTextNode(nullDisplayHandler(tracks[index].title));
                tdName.appendChild(textNodeName);

                const tdArtist = document.createElement('td');
                const textNodeArtist = document.createTextNode(nullDisplayHandler(tracks[index].artistName));
                tdArtist.appendChild(textNodeArtist);

                const tdDuration = document.createElement('td');
                const textNodeDuration = document.createTextNode(nullDisplayHandler(tracks[index].duration));
                tdDuration.appendChild(textNodeDuration);

                const tdAlbum = document.createElement('td');
                const textNodeAlbum = document.createTextNode(nullDisplayHandler(tracks[index].albumTitle));
                tdAlbum.appendChild(textNodeAlbum);

                const tdDateCreated = document.createElement('td');
                const textNodeDateCreated = document.createTextNode(nullDisplayHandler(tracks[index].dateCreated).split('T')[0]);
                tdDateCreated.appendChild(textNodeDateCreated);

                const tr = document.createElement('tr');
                tr.append(tdSerialNo, tdName, tdArtist, tdDuration, tdAlbum, tdDateCreated);

                tBodySearchTracks.append(tr);
            }

        })
        .catch((error) => {
            alert('Error ! : ' + error);
            console.log("error ::: " + error);
        });
}

const fetchAllPlaylists = () => {
    fetch(baseUrl + playlistsApiUrl)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            const playlists = response.data;
            tBodyPlaylists.innerHTML = '';
            if(!playlists || !playlists.length) return;
            noDataAvailablePlaylist.hidden = true;
            for(const index in playlists){
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

const resetSearchTracks = () => {
    inputSearchTracks.value = '';
    tBodySearchTracks.innerHTML = '';
    defaultTextSearchTracks.hidden = false;
    noRecordFoundTracks.hidden = true;
}

const nullDisplayHandler = (value) => {
    if (value === null) return '---';
    return value;
}

btnSearchTracks.addEventListener('click', searchTracks);
btnResetSearchTracks.addEventListener('click', resetSearchTracks);
fetchAllPlaylists();