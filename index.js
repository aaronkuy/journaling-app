//List for the entries
let entries = []
let editingEntryId = null
//When reload the page fetch the entries of the local storage
function loadEntries() {

    const savedEntries = localStorage.getItem('journalEntries')
    //Convert the string to JSON in order to display it in the DOM properly
    return savedEntries ? JSON.parse(savedEntries) : []
}
//Prevent refreshing the page when click the save button
function saveEntry(event) {
    event.preventDefault()
//Fetch the ID's from HTML
    const title = document.getElementById('entryTitle').value.trim();
    const content = document.getElementById('entryContent').value.trim();
//If editingEntryId is true, then applies the code beneath
    if(editingEntryId) {
        //Test if the selected entry id exist in the array 'entries', if so save the index to entryIndex
        const entryIndex = entries.findIndex(entry => entry.id === editingEntryId)
        //Access to the entry and overwrite the containing data
        entries[entryIndex] = {
            //Copy the prior data to this container
            ...entries[entryIndex],
            title: title,
            content: content
        }
    } else {
//unshift is shifting the new entry at the start
        entries.unshift({
            //generate the id by function
            id: generateId(),
            //paste the title and content to the corresponding key
            title: title,
            content: content
        })
    }
//Initialize the functions beneath
    closeEntryDialog()
    saveEntriesToStorage()
    renderEntries()
}
//Generate the ID in string (1970 January 01 to current date in milliseconds)
function generateId() {
    return Date.now().toString()
}
//Save entries to the local storage to the key 'journalEntries' by convert it to a string
function saveEntriesToStorage() {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
}

function deleteEntry(entryId) {
    //Save all entries unequal to the selected
    entries = entries.filter(entry => entry.id != entryId)
    //Save the array and display it in the DOM
    saveEntriesToStorage()
    renderEntries()
}

function renderEntries() {
    //Fetch the HTML main container by ID to entriesContainer
    const entriesContainer = document.getElementById('entriesContainer');
//If our DOM contains no entry, then the values and elements of the DOM are correspondingly
    //getting adjust to default
    if(entries.length === 0) {
        //Backtick in order to create a container, brainstorming elements
        entriesContainer.innerHTML = `
      <div class="empty-state">
        <h2>Journal is empty</h2>
        <p>Write about your day to get started!</p>
        <button class="add-entry-btn" onclick="openEntryDialog()">+ Create First Entry</button>
      </div>
    `
        return
    }
//.map() to iterate every entry of the array to create the corresponding container
    //supported by backtick to work out user responsive
    entriesContainer.innerHTML = entries.map(entry => `
    <div class="entry-card">
      <h3 class="entry-title">${entry.title}</h3>
      <p class="entry-content">${entry.content}</p>
      <div class="entry-actions">
        <button class="edit-btn" onclick="openEntryDialog('${entry.id}')" title="Edit Entry">
       
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteEntry('${entry.id}')" title="Delete Entry">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>
    </div>
    `).join('')
}
//When the user want to add or edit an entry
function openEntryDialog(entryId = null) {
    //Fetch the HTML elements by ID
    const dialog = document.getElementById('entryDialog');
    const titleInput = document.getElementById('entryTitle');
    const contentInput = document.getElementById('entryContent');
//If entryID is true, then execute the code beneath
    if(entryId) {
        //Find the equivalent from entryId under the key id inside the array entries
        //and allocate it to 'entryToEdit' (dictionary (entry) = entryToEdit)
        const entryToEdit = entries.find(entry => entry.id === entryId)
        //Put entry in the cache editingEntryId
        editingEntryId = entryId
        document.getElementById('dialogTitle').textContent = 'Edit Entry'
        //Extract the values of the selected entry saved under the specified key
        titleInput.value = entryToEdit.title
        contentInput.value = entryToEdit.content
    }
    else {
        //If no entry to edit is found, reset the value to zero, assume that the user
        //is about to add a new entry instead of editing, therefore adjust the strings
        editingEntryId = null
        document.getElementById('dialogTitle').textContent = 'Add New Entry'
        titleInput.value = ''
        contentInput.value = ''
    }
//focus selects automatically the title input field
    //showModal makes other elements in the DOM besides the dialog container blurred
    dialog.showModal()
    titleInput.focus()
}

function closeEntryDialog() {
    //Fetch the HTML dialog container to JS and initiate the close function
    //which disabling the container
    document.getElementById('entryDialog').close()
}

function toggleTheme() {
    //Implement the button toggle function by allocate the css 'dark-theme' settings to isDark
    //toggle gives you a boolean value in return
    const isDark = document.body.classList.toggle('dark-theme')
    //We save under the key 'theme' in the localstorage rather dark or light
    //'?' means if/else, if isDark is true then dark else light as a word saved inside the key
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    //Inside the DOM we are shifting the symbols depending on the boolean value of isDark for UX
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}
//Initiate dark mode in the body
function applyStoredTheme() {
    //Test if 'dark' was prior saved inside the localstorage
    if(localStorage.getItem('theme') === 'dark') {
        //If true, then initiate the css 'dark-theme' settings inside the body
        document.body.classList.add('dark-theme')
        //Change the symbol to sun for UX, so the user knows on what to click
        //when want to change to light mode again
        document.getElementById('themeToggleBtn').textContent = '☀️'
    }
}
//Wait until all HTML elements are fully loaded in order to prevent potentials errors and bugs
document.addEventListener('DOMContentLoaded', function() {
    //Set the right theme
    applyStoredTheme()
    //Allocate all entries saved in the localstorage to the array 'entries'
    entries = loadEntries()
    //Thereafter display it in the DOM
    renderEntries()

    //Await event/action by the user, if submit text then execute saveEntry function
    //if clicked on the toggle button then execute the toggleTheme function
    document.getElementById('entryForm').addEventListener('submit', saveEntry)
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('entryDialog').addEventListener('click', function(event) {
        if(event.target === this) {
            //Rather the user clicks inside the dialog the cancel, x or save entry button
            //in every case the closeEntryDialog is getting executed
            closeEntryDialog()
        }
    })
})
