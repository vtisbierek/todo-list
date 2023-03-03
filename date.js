const today = new Date(); //Date é um objeto padrão de JS

exports.getDate = function(){
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    return today.toLocaleDateString("en-US",options)
};

exports.getWeekDay = function(){
    const options = { weekday: 'long'};

    return today.toLocaleDateString("en-US",options);
};
  

