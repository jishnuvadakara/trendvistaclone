function generateOTP(){
    // Implement the login OTP generating here 
    // math.random method is use for generating random numbers
    
    return Math.floor(1000+Math.random()*9000).toString()
}
module.exports={generateOTP}