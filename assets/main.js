/* globals sortable Spinner  */

document.addEventListener('DOMContentLoaded', main)

function main () {
  document.querySelector('.activeList').addEventListener('click', play)
  document.querySelector('.activeList').addEventListener('click', deactivate)
  sortable('.activeList', {
    items: ':not(.empty)',
    placeholder: '<li class="empty list-group-item">&nbsp;</li>'
  })[0].addEventListener('sortupdate', updateSort)

  document.querySelector('.inActiveList').addEventListener('click', play)
  document.querySelector('.inActiveList').addEventListener('click', activate)

  let upload = document.querySelector('#dropzone')
  upload.addEventListener('change', selectUploads)
  upload.addEventListener('dragover', preventDefault)
  upload.addEventListener('drop', dropUploads)

  window.fetch('cgi-bin/getList.php').then(updateListen)
}

function selectUploads (changeEvent) {
  Array.from(changeEvent.target.files).forEach(uploadFile)
}

function preventDefault (dragOverEvent) {
  dragOverEvent.stopPropagation()
  dragOverEvent.preventDefault()
  dragOverEvent.dataTransfer.dropEffect = 'copy'
}

function dropUploads (dropEvent) {
  dropEvent.stopPropagation()
  dropEvent.preventDefault()
  Array.from(dropEvent.dataTransfer.files).forEach(uploadFile)
}

function uploadFile (file) {
  let data = new window.FormData()
  data.append('file', file)
  let spin = new Spinner(file.name)
  window.fetch('cgi-bin/doUpload.php', {
    method: 'POST',
    body: data
  })
  .then(r => r.text())
  .then(size => {
    if (+size !== file.size) {
      throw new Error(`Wrong file size (file: ${file.size}, upload: ${+size})`)
    }
    spin.success()
    return window.fetch('cgi-bin/getList.php')
  })
  .then(updateListen)
  .catch(err => spin.fail(err))
}

function updateListen (response) {
  response.json()
  .then(listen => {
    renderListe('.activeList', templateActiveList, listen.active)
    renderListe('.inActiveList', templateInactiveList, listen.inactive)
  })
}

function renderListe (selector, template, elements) {
  let list = document.querySelector(selector)
  while (list.firstChild) {
    list.removeChild(list.firstChild)
  }
  if (elements.length === 0) {
    return list.insertAdjacentHTML('beforeend', templateEmpty())
  }
  elements.forEach(song => list.insertAdjacentHTML('beforeend', template(song)))
}

function templateActiveList (song) {
  return `<li draggable="true" class="list-group-item" data-id="${song.id}">${song.name}
  <span class="duration">(${renderDuration(song.duration)})</span>
  <span class="play" data-file="${song.file}">▶</span>
  <button class="btn btn-sm btn-default">🗑</button></li>`
}
function templateInactiveList (song) {
  return `<li class="list-group-item" data-id="${song.id}">${song.name}
  <span class="duration">(${renderDuration(song.duration)})</span>
  <span class="play" data-file="${song.file}">▶</span>
  </li>`
}
function templateEmpty () {
  return `<li class="empty font-italic list-group-item">empty</li>`
}

function renderDuration (seconds) {
  let min = Math.floor(seconds / 60)
  return `${min}:${seconds - min * 60 < 10 ? '0' : ''}${seconds - min * 60}`
}

function activate (clickEvent) {
  let el = clickEvent.srcElement
  if (el.classList.contains('empty') || !('id' in el.dataset)) {
    return
  }
  window.fetch('cgi-bin/doActivate.php?id=' + +el.dataset.id)
  .then(updateListen)
}
function deactivate (clickEvent) {
  let el = clickEvent.srcElement
  if (el.tagName !== 'BUTTON') {
    return
  }
  window.fetch('cgi-bin/doInactivate.php?id=' + +el.parentElement.dataset.id)
  .then(updateListen)
}

function updateSort (sortupdateEvent) {
  let lis = sortupdateEvent.srcElement.querySelectorAll('li')
  window.fetch('cgi-bin/setOrder.php?order=' + JSON.stringify(
    Array.from(lis).map(li => li.dataset.id)
  )).then(updateListen)
}

function play (clickEvent) {
  let el = clickEvent.srcElement
  if ((el.tagName !== 'SPAN') || !el.classList.contains('play')) {
    return
  }
  clickEvent.stopPropagation()
  let audio = el.nextElementSibling
  if (!audio || (audio.tagName !== 'AUDIO')) {
    audio = document.createElement('audio')
    audio.src = 'musik/' + el.dataset.file
    el.parentNode.insertBefore(audio, el.nextSibling)
  }
  if (audio.classList.contains('playing')) {
    el.innerText = '▶'
    audio.classList.remove('playing')
    audio.pause()
    audio.currentTime = 0
  } else {
    let oldAudio = document.querySelector('.playing')
    if (oldAudio) {
      oldAudio.previousElementSibling.innerText = '▶'
      oldAudio.classList.remove('playing')
      oldAudio.pause()
      oldAudio.currentTime = 0
    }
    el.innerText = '■'
    audio.classList.add('playing')
    audio.play()
  }
}
