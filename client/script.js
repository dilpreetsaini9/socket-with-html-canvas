// Connect to the Socket.IO server
const socket = io('http://192.46.214.212:9090')

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const size = document.querySelector("#size")
const Color = document.querySelector(".color")
const inputForm = document.querySelector(".input-bar")
const textMessage = document.querySelector("#text-message")
const chatContainer = document.querySelector(".chat")

let selectedColor = "#000000"
let selectedSize = size.value

Color.addEventListener("change", (e) => {
    selectedColor = e.target.value
})

size.addEventListener("change", (e) => {
    selectedSize = e.target.value
})


function appendMe(data) {
    let newEl = document.createElement("p")
    newEl.classList.add("message")
    newEl.classList.add("sent")
    newEl.innerHTML = data
    chatContainer.append(newEl)
}


inputForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (textMessage.value.length <= 0) {
        return
    } else {
        let packet = textMessage.value
        socket.emit('message', { packet });
        appendMe(packet)
        textMessage.value = ""
    }

})


canvas.width = 400;
canvas.height = 600;


let drawing = false;
let lastX, lastY;


canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});


canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        draw(e);
    }
});


canvas.addEventListener('mouseup', () => {
    drawing = false;
});


function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = selectedSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit('drawing', { x, y, selectedColor, lastX, lastY, selectedSize });
    lastX = x;
    lastY = y;
}


socket.on('drawing', (data) => {
    ctx.strokeStyle = data.selectedColor;
    ctx.lineWidth = data.selectedSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
});


function appendChat(data) {
    let newEl = document.createElement("p")
    newEl.classList.add("message")
    newEl.classList.add("received")
    newEl.innerHTML = data
    chatContainer.append(newEl)
}


socket.on('message', (data) => {
    appendChat(data.packet)
});