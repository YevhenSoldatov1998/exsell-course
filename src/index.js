function Animal (name, color) {
  this.name = name;
  this.color = color;
  this.voice = function () {
    console.log('I can say: ' + this.name  + this.color)
  }

}

const cat = new Animal('Markiz', 'white')
cat.voice()