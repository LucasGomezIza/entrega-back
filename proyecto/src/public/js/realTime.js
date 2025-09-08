const socket = io()

let state = []

const grid = document.getElementById('rt-grid')

function render(products) {
    if (!grid) return;
    grid.innerHTML = products.map(p =>
        <article class="card" data-id="${p.id}">
            <h3>${p.title}</h3>
            <p>$${p.price}</p>
            <small>code: ${p.code} - id: ${p.id}</small>
        </article>
    ).join('')
}

socket.on('products:init', (list) => {
    state = list
    render(state)
})

socket.on('products:update', (evt) => {
    if (!evt) return
    if (evt.type === 'created') {
        state = [evt.product, ...state]
    } else if (evt.type === 'deleted') {
        state = state.filter(p => p.id !== Number(evt.productId))
    }
})