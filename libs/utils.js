export const transTime = (time) => {
    let minutes = parseInt(time / 60)
    if (Number.isNaN(minutes)) return '00:00' 
    minutes = minutes < 10 ? `0${minutes}` : minutes
    let secons = parseInt(time % 60)
    secons = secons < 10 ? `0${secons}` : secons
    return `${minutes}:${secons}`
}
