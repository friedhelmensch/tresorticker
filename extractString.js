module.exports = function (menu, today)
{
  console.log(today);
    var result = "Heute beim Tresor: \n";
    menu.reduce((initvalue, currentValue, i, array) => {
      if (currentValue === today) {
        //let´s see what happens if they don´t have tagesmenu on a specific day.
        result += array[i + 1] + "\n";
      }
      if (currentValue === "Täglich") {
        //assuming there are always 3 tagesgerichte
        result += array[i + 1] + "\n" + menu[i + 2] + "\n" + menu[i + 3];
      }
    }, 1);
    return result;
}
