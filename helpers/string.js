module.exports = {
  englishEnumeration : function(items){
    if(items.length == 1){
      return items[0];
    }else if(items.length > 1){
      var last = items[items.length-1]
      return items.slice(0,items.length-1).join(', ') + ' and ' + last
    }
    return null;
  }
} 