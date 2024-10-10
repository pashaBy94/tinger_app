function* generateSequence(questions, callbackSend, callbackSet) {
    const user = {}
    const listQuestions = Object.entries(questions);    
    for (let i = 0; i < listQuestions.length; i++){
        callbackSend(listQuestions[i][1]);
        user[listQuestions[i][0]] = yield;
    } 
    callbackSet(user)
  }

  module.exports = { generateSequence }