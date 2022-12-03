function sum(n){
    //回傳1+2+3+...+n結果
    let total = 0;
    for(let i=1 ; i <= n; i++){
        total += i;
    }
    return total;
}

console.log(sum(1)) //1
console.log(sum(2)) //3 
console.log(sum(3)) //6 
console.log(sum(10)) //55 