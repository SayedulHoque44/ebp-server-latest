
const currentTime = new Date()//2024-01-27T13:28:57.215Z

const fn = ()=>{
    const T= new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate()
    )
    return T
}

console.log(fn())