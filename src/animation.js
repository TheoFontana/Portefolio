// const cards = document.getElementsByClassName("card-effect")
// for (let card of cards) {
//     card.addEventListener('mousemove', e => {
//         const el = e.target.closest(".card-effect")
//         const rect = el.getBoundingClientRect();
//
//         const x = -1 + 2 * ((e.clientX - rect.left) / el.offsetWidth)
//         const y = 1 - 2 * ((e.clientY - rect.top) / el.offsetHeight)
//         const dist = Math.sqrt( x** 2 + y ** 2)
//         // el.style.transform = `rotate3D(${y}, ${x}, 0, ${-10 * dist}deg)`
//     })
//     card.addEventListener('mouseleave', e => {
//         const el = e.target.closest(".card-effect")
//         // el.style.transform = `rotate3D(0,0,0,0deg)`
//     })
// }