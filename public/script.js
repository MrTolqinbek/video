const socket = io()
let myStream
let peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '9000'
})

socket.on('createmessage', (msg) => {
    document.querySelector('.chat').innerHTML +=
        `<div class="message">${msg}</div>`
    document.querySelector('.chat').scrollTop = document.querySelector('.chat').scrollHeight
})

window.navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then((stream) => {
    myStream = stream
    addStream(document.createElement('video'), stream)
    peer.on('call', call => {
        call.answer(myStream)
        const video = document.createElement('video')
        call.on('stream', (str) => {
            addStream(video, str)
        })
    })

    socket.on('connect-user', (userID) => {
        const call = peer.call(userID, myStream)
        const video = document.createElement('video')
        call.on('stream', (str) => {
            addStream(video, str)
        })
    })



})


peer.on('open', (e) => {
    socket.emit('join', roomId, e)
})

function addStream(video, stream) {
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    video.srcObject = stream
    // video.play()
    video.muted = false
    document.getElementById('video').append(video)
}
document.getElementById('btn').addEventListener('click', () => {
    socket.emit('message', document.querySelector('input').value)
    document.querySelector('input').value = ""
})

document.querySelector('.leave').addEventListener('click', () => {

})
