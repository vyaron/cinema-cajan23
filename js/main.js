'use strict'

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages
// ITP: Auto close the modal after 3s

var gElSelectedSeat = null
const gCinema = createCinema()

function onInit() {
    renderCinema()
}

function createCinema() {
    const cinema = []
    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 15; j++) {
            const cell = {
                isSeat : (j !== 7)
            }
            if (cell.isSeat) cell.price = 8 + i

            cinema[i][j] = cell
        }
    }

    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]

            // for cell of type SEAT add seat class
            var className = (cell.isSeat) ? 'seat' : ''
            className += (cell.isBooked) ? ' booked' : ''

            // add a seat title:
            const title = `Seat: ${i + 1}, ${j + 1}`

            // TODO: for cell that is booked add booked class

            strHTML += `\t<td class="cell ${className}" title="${title}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]

    // ignore none seats and booked
    if (!cell.isSeat || cell.isBooked) return

    // console.log('Cell clicked: ', elCell, i, j)

    // Support selecting a seat
    // Only a single seat should be selected
    elCell.classList.toggle('selected')
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }
    gElSelectedSeat = (elCell !== gElSelectedSeat) ? elCell : null

    // When seat is selected a popup is shown
    if (gElSelectedSeat) onShowSeatDetails({ i: i, j: j })
    else onHideSeatDetails()
}

function onShowSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]
    elPopup.querySelector('h2 span').innerText = `${pos.i+1}-${pos.j+1}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    elPopup.querySelector('p').innerText = JSON.stringify(getAvailableSeats(pos))

    const elBtnBook = elPopup.querySelector('.btn-book')
    elBtnBook.dataset.i = pos.i
    elBtnBook.dataset.j = pos.j

    elPopup.hidden = false
}

function onHideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    // console.log('Booking seat, button: ', elBtn)

    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()
    unSelectSeat()
}

function unSelectSeat() {
    onHideSeatDetails()
    gElSelectedSeat.classList.remove('selected')
    gElSelectedSeat = null
}

function getAvailableSeats(pos) {
    var seats = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gCinema[i].length) continue
            if (i === pos.i && j === pos.j) continue
            // push the {i, j} of available seats
            const cell = gCinema[i][j]
            if (cell.isSeat && !cell.isBooked) seats.push({i:i+1, j:j+1})
        }
    }
    return seats
}

