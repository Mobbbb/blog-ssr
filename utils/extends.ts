function accAdd(arg1: number, arg2: number): number { 
    var r1, r2, m
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }  
    
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10,Math.max(r1,r2))
    return (arg1 * m + arg2 * m) / m
}

interface Array<T> {
    remove(val: any): void;
}

interface Number {
    addScore(arg: number): number;
}

Number.prototype.addScore = function(arg: number) {
    return accAdd(arg, this as number)
}

Array.prototype.remove = function(val: any) { 
    var index = this.indexOf(val)
    if (index > -1) { 
        this.splice(index, 1)
    } 
}
