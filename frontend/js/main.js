"use strict";

// dom elements
const inputSearchTracks = document.getElementById('inputSearchTracks');
const tBodySearchTracks = document.getElementById('tBodySearchTracks');
const defaultTextSearchTracks = document.getElementById('defaultTextSearchTracks');
const noRecordFoundTracks = document.getElementById('noRecordFoundTracks');
const noDataAvailablePlaylist = document.getElementById('noDataAvailablePlaylist');
const tBodyPlaylists = document.getElementById('tBodyPlaylists');
const inputSearchTracksForPlaylist = document.getElementById('inputSearchTracksForPlaylist');
const playlistName = document.getElementById('playlistName');
const playlistNameView = document.getElementById('playlistNameView');
const tbodyViewTracksForPlaylist = document.getElementById('tbodyViewTracksForPlaylist');
const inputSearchTracksForPlaylistEdit = document.getElementById('inputSearchTracksForPlaylistEdit');
const tbodyCreateTracksForPlaylist = document.getElementById('tbodyCreateTracksForPlaylist');
const playlistNameEdit = document.getElementById('playlistNameEdit');
const tbodyEditTracksForPlaylist = document.getElementById('tbodyEditTracksForPlaylist');
const deleteMessageP = document.getElementById('deleteMessageP');

// messages
const messages = {
    NO_VALUE_ENTERED: 'No value entered',
    ONE_OR_MORE_REQUIRED_PARAM_IS_INVALID: 'One or more required parameter is INVALID',
    DATA_CREATED_SUCCESSFULLY: 'Data created successfully',
    DATA_UPDATED_SUCCESSFULLY: 'Data updated successfully',
    DATA_DELETED_SUCCESSFULLY: 'Data deleted successfully',
};

// api urls
const baseUrl = 'http://localhost:3001';
const tracksApiUrl = '/api/tracks';
const playlistsApiUrl = '/api/playlists';

// http options
const httpHeaders = {
    'Content-Type': 'application/json'
};

const maxNoOfRecords = 10;

let globalListOfTrackIds = [];
let playlistIdToDelete;
// functions
async function displaySearchedTracks() {
    const searchText = inputSearchTracks.value.trim();
    if (!searchText) {
        alert(messages.NO_VALUE_ENTERED);
        return;
    }
    try {
        const response = await apiSearchTracks(searchText);
        const tracks = response.data;
        tBodySearchTracks.innerHTML = '';
        defaultTextSearchTracks.hidden = true;
        if (!tracks || !tracks.length) {
            noRecordFoundTracks.hidden = false;
            return;
        }
        noRecordFoundTracks.hidden = true;
        for (const index in tracks) {
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
    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function displayAllPlaylists() {
    try {
        const response = await apiGetAllPlaylistInfo();
        const playlists = response.data;
        tBodyPlaylists.innerHTML = '';
        if (!playlists || !playlists.length) {
            noDataAvailablePlaylist.hidden = false;
            return;}
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

            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.classList.add('blue');
            viewButton.classList.add('open-modal');
            viewButton.setAttribute('data-id', playlists[index].id);
            viewButton.setAttribute('data-target', 'view-playlist-modal');
            viewButton.addEventListener('click', (event) => {
                viewPlaylist(event);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('saffron');
            editButton.classList.add('open-modal');
            editButton.setAttribute('data-id', playlists[index].id);
            editButton.setAttribute('data-target', 'edit-playlist-modal');
            editButton.addEventListener('click', (event) => {
                viewEditPlaylist(event);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('danger');
            deleteButton.classList.add('open-modal');
            deleteButton.setAttribute('data-id', playlists[index].id);
            deleteButton.setAttribute('data-name', playlists[index].name);
            deleteButton.setAttribute('data-target', 'delete-playlist-modal');
            deleteButton.addEventListener('click', (event) => {
                viewDeletePlaylist(event);
            });

            const tdAction = document.createElement('td');
            tdAction.append(viewButton, editButton, deleteButton);

            const tr = document.createElement('tr');

            tr.append(tdSerialNo, tdName, tdNoOfTracks, tdTotalPlaytime, tdAction);

            tBodyPlaylists.append(tr);
        }
    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function viewPlaylist(event) {
    const id = event.target.getAttribute('data-id');
    console.log("id ::: " + id);
    try {
        // get playlist by id
        const response = await apiGetPlaylistById(id);
        console.log('response::: ' + JSON.stringify(response));
        const {message, data} = response;
        if (!data) {
            alert("ERROR ! : " + message);
            return;
        }
        playlistNameView.value = data.name;
        const tracks = data.tracks;
        tbodyViewTracksForPlaylist.innerHTML = '';
        for (const index in tracks) {
            const tdSerialNo = document.createElement('td');
            const serialNo = String(Number(index) + 1);
            const textNodeSerialNo = document.createTextNode(serialNo);
            tdSerialNo.appendChild(textNodeSerialNo);

            const tdTitle = document.createElement('td');
            const textNodeTitle = document.createTextNode(nullDisplayHandler(tracks[index].title));
            tdTitle.appendChild(textNodeTitle);

            const tdArtist = document.createElement('td');
            const textNodeArtist = document.createTextNode(nullDisplayHandler(tracks[index].artistName));
            tdArtist.appendChild(textNodeArtist);

            const tdPlaytime = document.createElement('td');
            const textNodePlaytime = document.createTextNode(nullDisplayHandler(tracks[index].duration));
            tdPlaytime.appendChild(textNodePlaytime);

            const tdAlbum= document.createElement('td');
            const textNodeAlbum = document.createTextNode(nullDisplayHandler(tracks[index].albumTitle));
            tdAlbum.appendChild(textNodeAlbum);

            const tr = document.createElement('tr');

            tr.append(tdSerialNo, tdTitle, tdArtist, tdPlaytime, tdAlbum);

            tbodyViewTracksForPlaylist.append(tr);
        }


    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }

}

async function viewEditPlaylist(event) {
    const id = event.target.getAttribute('data-id');
    console.log("id ::: " + id);
    try {
        // get playlist by id
        const response = await apiGetPlaylistById(id);
        console.log('response::: ' + JSON.stringify(response));
        const {message, data} = response;
        if (!data) {
            alert("ERROR ! : " + message);
            return;
        }
        playlistNameEdit.value = data.name;
        const tracks = data.tracks;
        tbodyEditTracksForPlaylist.innerHTML = '';
        globalListOfTrackIds = [];
        for (const index in tracks) {
            const tdTitle = document.createElement('td');
            const textNodeTitle = document.createTextNode(nullDisplayHandler(tracks[index].title));
            tdTitle.appendChild(textNodeTitle);

            const tdArtist = document.createElement('td');
            const textNodeArtist = document.createTextNode(nullDisplayHandler(tracks[index].artistName));
            tdArtist.appendChild(textNodeArtist);

            const tdPlaytime = document.createElement('td');
            const textNodePlaytime = document.createTextNode(nullDisplayHandler(tracks[index].duration));
            tdPlaytime.appendChild(textNodePlaytime);

            const tdAlbum= document.createElement('td');
            const textNodeAlbum = document.createTextNode(nullDisplayHandler(tracks[index].albumTitle));
            tdAlbum.appendChild(textNodeAlbum);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.classList.add('danger');
            deleteButton.setAttribute('data-id', tracks[index].id);
            deleteButton.addEventListener('click', (event) => {
                const dataId =  event.target.getAttribute('data-id');
                document.getElementById(dataId).remove();
                globalListOfTrackIds.splice(globalListOfTrackIds.indexOf(dataId), 1);
            });

            const tdAction = document.createElement('td');
            tdAction.appendChild(deleteButton);

            const tr = document.createElement('tr');
            tr.append(tdTitle, tdArtist, tdPlaytime, tdAlbum, tdAction);
            tr.id = tracks[index].id;

            tbodyEditTracksForPlaylist.append(tr);
            globalListOfTrackIds.push(tracks[index].id);
        }
    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function viewDeletePlaylist (event) {
    const playlistName = event.target.getAttribute('data-name');
    deleteMessageP.textContent = 'Are you sure you want to delete: ' + playlistName;
    playlistIdToDelete = event.target.getAttribute('data-id');
}

async function suggestTrack(event) {
    const searchText = event.target.value.trim();
    if (!searchText) return;
    const response = await apiSearchTracks(searchText);
    const tracks = response.data;
    if (!tracks || !tracks.length) return;
    autocomplete(event.target, tracks);
}

// createPlaylist
async function createPlaylist() {
    const name = playlistName.value.trim();
    if (!name) {
        alert(messages.ONE_OR_MORE_REQUIRED_PARAM_IS_INVALID);
        return;
    }
    if (!globalListOfTrackIds || !globalListOfTrackIds.length) {
        alert(messages.ONE_OR_MORE_REQUIRED_PARAM_IS_INVALID);
        return;
    }
    const playlist = {
        name: name,
        trackIds: globalListOfTrackIds
    };
    console.log("playlist :: " + JSON.stringify(playlist));
    try {
        const response = await apiCreatePlaylist(playlist);
        console.log("response ::: " + JSON.stringify(response));
        const {message, data} = response;
        if (!data) {
            alert("ERROR ! : " + message);
            return;
        }
        alert("SUCCESS !" + messages.DATA_CREATED_SUCCESSFULLY);
        hideAllModalWindows();
        // await displayAllPlaylists();
        await init();

    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function updatePlaylist () {
    const name = playlistNameEdit.value.trim();
    if (!name) {
        alert(messages.ONE_OR_MORE_REQUIRED_PARAM_IS_INVALID);
        return;
    }
    if (!globalListOfTrackIds || !globalListOfTrackIds.length) {
        alert(messages.ONE_OR_MORE_REQUIRED_PARAM_IS_INVALID);
        return;
    }
    const playlist = {
        name: name,
        trackIds: globalListOfTrackIds
    };
    console.log("playlist :: " + JSON.stringify(playlist));
    try {
        const response = await apiUpdatePlaylist(playlist);
        console.log("response ::: " + JSON.stringify(response));
        const {message, data} = response;
        if (!data) {
            alert("ERROR ! : " + message);
            return;
        }
        alert("SUCCESS !" + messages.DATA_UPDATED_SUCCESSFULLY);
        hideAllModalWindows();
        await init();
    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function deletePlaylist () {
    try {
        const response = await apiDeletePlaylist(playlistIdToDelete);
        console.log("response ::: " + JSON.stringify(response));
        const {message, data} = response;
        if (!data) {
            alert("ERROR ! : " + message);
            return;
        }
        alert("SUCCESS !" + messages.DATA_DELETED_SUCCESSFULLY);
        hideAllModalWindows();
        await init();
    } catch (error) {
        console.log("error ::: " + error);
        alert('Error ! : ' + error);
    }
}

async function apiSearchTracks(searchText) {
    const queryParams = new URLSearchParams({
        searchText: searchText,
        maxNoOfRecords: maxNoOfRecords,
    });
    return await httpGet(baseUrl + tracksApiUrl + '?' + queryParams);
}

async function apiGetAllPlaylistInfo() {
    return await httpGet(baseUrl + playlistsApiUrl);
}

async function apiCreatePlaylist(data) {
    return await httpPost(baseUrl + playlistsApiUrl, data);
}

async function apiGetPlaylistById(id) {
    return await httpGet(baseUrl + playlistsApiUrl + '/' + id);
}

async function apiUpdatePlaylist(data) {
    return await httpPut(baseUrl + playlistsApiUrl, data);
}

async function apiDeletePlaylist(id) {
    return await httpDelete(baseUrl + playlistsApiUrl + '/' + id);
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
    const modalTargetId = "#" + buttonEl.getAttribute("data-target");

    // patch code :(
    const modalTarget = document.querySelector(modalTargetId);

    if(modalTarget.id === 'create-playlist-modal') {
        playlistName.value = '';
        tbodyCreateTracksForPlaylist.innerHTML = '';
        globalListOfTrackIds = [];
    }

    document.querySelector(".modal-fader").className += " active";
    modalTarget.className += " active";

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

function autocomplete(inp, arr) {
    const tbodyId = inp.getAttribute('data-table');
    const tbody = document.querySelector('#' + tbodyId);
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (event) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            // if (arr[i].substring(0, val.length).toUpperCase() === val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr[i].substring(0, val.length) + "</strong>";
            // b.innerHTML += arr[i].substring(val.length);
            b.innerHTML = arr[i].title + ' - ' + '<em>' + arr[i].artistName + '</em>';
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i].title + "'>";
            b.innerHTML += "<input type='hidden' value='" + arr[i].artistName + "'>";
            b.innerHTML += "<input type='hidden' value='" + arr[i].id + "'>";
            b.innerHTML += "<input type='hidden' value='" + arr[i].duration + "'>";
            b.innerHTML += "<input type='hidden' value='" + arr[i].albumTitle + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = '';
                const title = this.getElementsByTagName("input")[0].value;
                const artistName = this.getElementsByTagName("input")[1].value;
                const id = Number(this.getElementsByTagName("input")[2].value);
                const playtime = this.getElementsByTagName("input")[3].value;
                const album = this.getElementsByTagName("input")[4].value;
                if (globalListOfTrackIds.indexOf(id) === -1) {

                    const tdTitle = document.createElement('td');
                    const textNodeTitle = document.createTextNode(nullDisplayHandler(title));
                    tdTitle.appendChild(textNodeTitle);

                    const tdArtist = document.createElement('td');
                    const textNodeArtist = document.createTextNode(nullDisplayHandler(artistName));
                    tdArtist.appendChild(textNodeArtist);

                    const tdPlaytime = document.createElement('td');
                    const textNodePlaytime = document.createTextNode(nullDisplayHandler(playtime));
                    tdPlaytime.appendChild(textNodePlaytime);

                    const tdAlbum= document.createElement('td');
                    const textNodeAlbum = document.createTextNode(nullDisplayHandler(album));
                    tdAlbum.appendChild(textNodeAlbum);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Remove';
                    deleteButton.classList.add('danger');
                    deleteButton.setAttribute('data-id', ""+id);
                    deleteButton.addEventListener('click', (event) => {
                        console.log("remove !!!");
                        const dataId =  event.target.getAttribute('data-id');
                        document.getElementById(dataId).remove();
                        globalListOfTrackIds.splice(globalListOfTrackIds.indexOf(dataId), 1);
                    });

                    const tdAction = document.createElement('td');
                    tdAction.appendChild(deleteButton);

                    const tr = document.createElement('tr');
                    tr.append(tdTitle, tdArtist, tdPlaytime, tdAlbum, tdAction);
                    tr.id = ""+id;

                    tbody.append(tr);

                    globalListOfTrackIds.push(id);
                }
                console.log("globalListOfTrackIds ::: " + globalListOfTrackIds);
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
            // }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode === 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(element) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (element !== x[i] && element !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

async function init() {
    await displayAllPlaylists();
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

inputSearchTracksForPlaylist.addEventListener('input', async (event) => {
    await suggestTrack(event);
});
inputSearchTracksForPlaylistEdit.addEventListener('input', async (event) => {
    await suggestTrack(event);
});

init().catch((error) => {
    console.log(error)
});